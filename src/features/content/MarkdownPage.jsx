import { useState, useEffect, useRef, isValidElement, cloneElement } from 'react';
import ReactMarkdown from 'react-markdown';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { annotationStorage } from './annotationStorage';
import './MarkdownPage.css';

/**
 * MarkdownPage - Template for rendering markdown content with annotations
 * Features:
 * - Three-panel layout: left nav (from H2s), center content, right annotations
 * - Text selection and annotation creation
 * - Yellow squiggly underline for annotated text
 * - Annotation CRUD with localStorage persistence
 * - Public edit suggestions
 */

const MarkdownPage = ({ content = '', pageId = 'default-page', title = 'Content' }) => {
  const [annotations, setAnnotations] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [selectedTextRange, setSelectedTextRange] = useState(null);
  const [showAnnotationInput, setShowAnnotationInput] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [editingAnnotationId, setEditingAnnotationId] = useState(null);
  const [focusedAnnotationId, setFocusedAnnotationId] = useState(null);
  const [annotationPositions, setAnnotationPositions] = useState({});
  const [annotationStackHeight, setAnnotationStackHeight] = useState(0);
  const contentRef = useRef(null);
  const annotationRefsMap = useRef({});
  const annotationsRef = useRef(null);
  const annotationsListRef = useRef(null);
  const [annotationInputTop, setAnnotationInputTop] = useState(null);
  const annotationInputRef = useRef(null);

  // Load annotations from localStorage on mount
  useEffect(() => {
    const savedAnnotations = annotationStorage.getPageAnnotations(pageId);
    // Sort by text position so they appear in order
    const sorted = savedAnnotations.sort((a, b) => (a.textPosition || 0) - (b.textPosition || 0));
    setAnnotations(sorted);
  }, [pageId]);

  // Extract H2s from markdown to build navigation
  useEffect(() => {
    const headings = [];
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        const text = line.replace(/^## /, '').trim();
        const id = `heading-${index}`;
        headings.push({ id, text, lineIndex: index });
      }
    });
    setHeadings(headings);
  }, [content]);

  // Handle text selection in content area
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const selected = selection.toString().trim();

      if (selected && contentRef.current) {
        try {
          const range = selection.getRangeAt(0);
          const isInContent = contentRef.current.contains(range.commonAncestorContainer);
          
          if (isInContent) {
            // Get the position of the selection
            const rect = range.getBoundingClientRect();
            const contentRect = contentRef.current.getBoundingClientRect();
            const relativeTop = rect.top - contentRect.top;
            
            setSelectedText(selected);
            setSelectedTextRange({ text: selected, top: relativeTop });
            setShowAnnotationInput(true);
            setFocusedAnnotationId(null); // Clear focused annotation when new text is selected
          }
        } catch (e) {
          console.error('Selection error:', e);
        }
      }
    };

    if (contentRef.current) {
      contentRef.current.addEventListener('mouseup', handleMouseUp);
      return () => {
        contentRef.current?.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, []);

  useEffect(() => {
    if (!showAnnotationInput || !selectedTextRange) {
      setAnnotationInputTop(null);
      return;
    }

    const computeTop = () => {
      if (!contentRef.current || !annotationsRef.current) return null;
      const contentRect = contentRef.current.getBoundingClientRect();
      const annotationsRect = annotationsRef.current.getBoundingClientRect();
      const absoluteTop = contentRect.top + (selectedTextRange.top || 0);
      let topInPanel = absoluteTop - annotationsRect.top - 8; // small offset
      const panelHeight = annotationsRect.height;
      const maxTop = Math.max(8, panelHeight - 200);
      if (topInPanel < 8) topInPanel = 8;
      if (topInPanel > maxTop) topInPanel = maxTop;
      return topInPanel;
    };

    const top = computeTop();
    setAnnotationInputTop(top);
  }, [showAnnotationInput, selectedTextRange]);

  // Compute absolute positions for saved annotations so they appear near highlighted text
  useEffect(() => {
    const computePositions = () => {
      if (!contentRef.current || !annotationsListRef.current) return;
      const contentRect = contentRef.current.getBoundingClientRect();
      const listRect = annotationsListRef.current.getBoundingClientRect();
      const listScrollTop = annotationsListRef.current.scrollTop;

      // Measure each annotation desired position and height in original order
      const measured = annotations.map(a => {
        const absoluteTop = contentRect.top + (a.textPosition || 0);
        // Desired position in list content coordinates
        let pos = absoluteTop - listRect.top + listScrollTop;
        if (pos < 8) pos = 8;
        const el = annotationRefsMap.current[a.id];
        const height = el ? el.getBoundingClientRect().height : 80;
        return { id: a.id, pos, height };
      });

      if (measured.length === 0) {
        setAnnotationPositions({});
        setAnnotationStackHeight(0);
        return;
      }

      const spacing = 8;
      const newPositions = {};
      const n = measured.length;

      // If there's a focused annotation, keep order and anchor focused near its desired position
      const focusedIndex = focusedAnnotationId ? measured.findIndex(m => m.id === focusedAnnotationId) : -1;

      if (focusedIndex >= 0) {
        // Place focused as close as possible to desired
        const focused = measured[focusedIndex];
        const focusedTop = Math.max(8, focused.pos);
        newPositions[focused.id] = focusedTop;

        // Place preceding annotations upward in reverse order (preserving order)
        for (let i = focusedIndex - 1; i >= 0; i--) {
          const item = measured[i];
          const nextTop = newPositions[measured[i + 1].id];
          const maxTop = nextTop - spacing - item.height;
          const preferred = Math.max(8, item.pos);
          let top = Math.min(preferred, maxTop);
          if (top < 8) top = 8;
          newPositions[item.id] = top;
        }

        // Place following annotations downward in order
        for (let i = focusedIndex + 1; i < n; i++) {
          const item = measured[i];
          const prevTop = newPositions[measured[i - 1].id];
          const prevHeight = measured[i - 1].height;
          const minTop = prevTop + prevHeight + spacing;
          const preferred = Math.max(8, item.pos);
          const top = Math.max(preferred, minTop);
          newPositions[item.id] = top;
        }

        // If top got clamped, preserve gaps by pushing later items down
        for (let i = 1; i < n; i++) {
          const prev = measured[i - 1];
          const curr = measured[i];
          const minTop = (newPositions[prev.id] || 8) + prev.height + spacing;
          if ((newPositions[curr.id] || 0) < minTop) {
            newPositions[curr.id] = minTop;
          }
        }
      } else {
        // No focused annotation: stable sequential layout in saved order
        let cursor = 8;
        measured.forEach(item => {
          const preferred = Math.max(8, item.pos);
          const top = Math.max(preferred, cursor);
          newPositions[item.id] = top;
          cursor = newPositions[item.id] + item.height + spacing;
        });
      }

      const last = measured[n - 1];
      const stackHeight = (newPositions[last.id] || 8) + last.height + 8;
      setAnnotationPositions(newPositions);
      setAnnotationStackHeight(stackHeight);
    };

    computePositions();

    const ro = new ResizeObserver(() => computePositions());
    if (contentRef.current) ro.observe(contentRef.current);
    if (annotationsListRef.current) ro.observe(annotationsListRef.current);
    window.addEventListener('resize', computePositions);
    window.addEventListener('scroll', computePositions);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computePositions);
      window.removeEventListener('scroll', computePositions);
    };
  }, [annotations, focusedAnnotationId]);

  // Focus the annotation textarea without causing browser to scroll
  useEffect(() => {
    if (showAnnotationInput && annotationInputRef.current) {
      try {
        annotationInputRef.current.focus({ preventScroll: true });
      } catch (e) {
        // Older browsers may not support preventScroll
        annotationInputRef.current.focus();
      }
    }
  }, [showAnnotationInput, annotationInputRef.current]);

  // Create new annotation
  const handleCreateAnnotation = () => {
    if (!annotationText.trim() || !selectedText) {
      return;
    }

    const newAnnotation = {
      id: `annotation-${Date.now()}`,
      text: annotationText,
      selectedText: selectedText,
      timestamp: new Date().toISOString(),
      textPosition: selectedTextRange?.top || 0
    };

    const updatedAnnotations = [...annotations, newAnnotation].sort((a, b) => a.textPosition - b.textPosition);
    setAnnotations(updatedAnnotations);
    annotationStorage.saveAnnotation(pageId, newAnnotation);

    // Reset form and keep focused on the new annotation
    setAnnotationText('');
    setSelectedText('');
    setShowAnnotationInput(false);
    setSelectedTextRange(null);
    setFocusedAnnotationId(newAnnotation.id);
  };

  // Update annotation
  const handleUpdateAnnotation = (annotationId, newText) => {
    const updatedAnnotations = annotations.map(a =>
      a.id === annotationId ? { ...a, text: newText } : a
    ).sort((a, b) => (a.textPosition || 0) - (b.textPosition || 0));
    setAnnotations(updatedAnnotations);
    annotationStorage.updateAnnotation(pageId, annotationId, { text: newText });
    setEditingAnnotationId(null);
    setFocusedAnnotationId(annotationId);
  };

  // Delete annotation
  const handleDeleteAnnotation = (annotationId) => {
    const updatedAnnotations = annotations.filter(a => a.id !== annotationId);
    setAnnotations(updatedAnnotations);
    annotationStorage.deleteAnnotation(pageId, annotationId);
    setFocusedAnnotationId(null);
  };

  // Suggest public edit
  const handleSuggestEdit = (annotation) => {
    const suggestion = {
      type: 'annotation-edit-suggestion',
      selectedText: annotation.selectedText,
      suggestion: annotation.text,
      timestamp: new Date().toISOString(),
      page: pageId
    };

    // Generate a formatted suggestion string
    const suggestionText = `Edit Suggestion for "${pageId}":\n\nSelected text: "${annotation.selectedText}"\n\nSuggestion: ${annotation.text}\n\nTimestamp: ${suggestion.timestamp}`;

    // Copy to clipboard and alert user
    navigator.clipboard.writeText(suggestionText).then(() => {
      alert('Edit suggestion copied to clipboard! You can paste it in an issue or email.');
    }).catch(() => {
      alert('Failed to copy. Suggestion:\n\n' + suggestionText);
    });
  };

  const renderHighlightedNode = (node, keyPrefix = 'node') => {
    if (typeof node === 'string') {
      let segments = [node];

      annotations.forEach((annotation) => {
        if (!annotation.selectedText) return;

        const nextSegments = [];
        segments.forEach((segment) => {
          if (typeof segment !== 'string') {
            nextSegments.push(segment);
            return;
          }

          const parts = segment.split(annotation.selectedText);
          if (parts.length === 1) {
            nextSegments.push(segment);
            return;
          }

          parts.forEach((part, idx) => {
            if (part) {
              nextSegments.push(part);
            }
            if (idx < parts.length - 1) {
              nextSegments.push(
                <span
                  key={`${keyPrefix}-${annotation.id}-${idx}`}
                  className={`markdown-page__annotated-text ${focusedAnnotationId === annotation.id ? 'focused' : ''}`}
                  data-annotation-id={annotation.id}
                  title={annotation.text}
                  onClick={() => {
                    setFocusedAnnotationId(annotation.id);
                    const annotationElement = document.querySelector(`[data-annotation-ref="${annotation.id}"]`);
                    annotationElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                >
                  {annotation.selectedText}
                </span>
              );
            }
          });
        });

        segments = nextSegments;
      });

      return segments;
    }

    if (Array.isArray(node)) {
      return node.map((child, idx) => (
        <span key={`${keyPrefix}-${idx}`}>
          {renderHighlightedNode(child, `${keyPrefix}-${idx}`)}
        </span>
      ));
    }

    if (isValidElement(node)) {
      return cloneElement(
        node,
        node.props,
        renderHighlightedNode(node.props.children, `${keyPrefix}-child`)
      );
    }

    return node;
  };

  // Navigate to heading
  const handleHeadingClick = (headingId) => {
    setActiveHeading(headingId);
    // Scroll to the section
    const section = document.querySelector(`[data-heading-id="${headingId}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Format date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Export annotations
  const handleExportAnnotations = () => {
    const json = annotationStorage.exportAsJSON();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
    element.setAttribute('download', `annotations-${pageId}-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Import annotations
  const handleImportAnnotations = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (annotationStorage.importFromJSON(event.target.result)) {
            const imported = annotationStorage.getPageAnnotations(pageId);
            setAnnotations(imported);
            alert('Annotations imported successfully!');
          } else {
            alert('Failed to import annotations. Check file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="markdown-page">
      <Header />
      
      <div className="markdown-page__body">
        {/* Left Navigation */}
        <nav className="markdown-page__nav">
          {headings.map(heading => (
            <button
              key={heading.id}
              className={`markdown-page__nav-item ${activeHeading === heading.id ? 'active' : ''}`}
              onClick={() => handleHeadingClick(heading.id)}
              data-heading-id={heading.id}
            >
              {heading.text}
            </button>
          ))}
        </nav>

        {/* Center Content */}
        <div
          className="markdown-page__content"
          ref={contentRef}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => {
                return <p>{renderHighlightedNode(children, 'p')}</p>;
              },
              li: ({ children }) => <li>{renderHighlightedNode(children, 'li')}</li>,
              h1: ({ children }) => <h1>{renderHighlightedNode(children, 'h1')}</h1>,
              h2: ({ children }) => <h2>{renderHighlightedNode(children, 'h2')}</h2>,
              h3: ({ children }) => <h3>{renderHighlightedNode(children, 'h3')}</h3>,
              h4: ({ children }) => <h4>{renderHighlightedNode(children, 'h4')}</h4>,
              h5: ({ children }) => <h5>{renderHighlightedNode(children, 'h5')}</h5>,
              h6: ({ children }) => <h6>{renderHighlightedNode(children, 'h6')}</h6>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Right Annotations Panel */}
        <aside className="markdown-page__annotations" ref={annotationsRef}>
          <div className="markdown-page__annotations-header">
            <h3 className="markdown-page__annotations-title">Your Annotations</h3>
          </div>

          {/* Annotation List */}
          <div className="markdown-page__annotations-list" ref={annotationsListRef}>
            <div style={{ height: `${annotationStackHeight}px`, pointerEvents: 'none' }} />
            {annotations.map(annotation => (
              <div
                key={annotation.id}
                ref={(el) => {
                  if (el) annotationRefsMap.current[annotation.id] = el;
                }}
                data-annotation-ref={annotation.id}
                className={`markdown-page__annotation-card ${editingAnnotationId === annotation.id ? 'editing' : ''} ${focusedAnnotationId === annotation.id ? 'focused' : ''}`}
                style={{ top: annotationPositions[annotation.id] !== undefined ? `${annotationPositions[annotation.id]}px` : undefined }}
                onClick={() => setFocusedAnnotationId(annotation.id)}
              >
                {editingAnnotationId === annotation.id ? (
                  <>
                    <textarea
                      value={annotation.text}
                      onChange={(e) => {
                        setAnnotations(annotations.map(a =>
                          a.id === annotation.id ? { ...a, text: e.target.value } : a
                        ));
                      }}
                      className="markdown-page__annotation-text"
                    />
                    <div className="markdown-page__annotation-actions">
                      <button
                        className="markdown-page__annotation-action"
                        onClick={() => handleUpdateAnnotation(annotation.id, annotation.text)}
                      >
                        Save
                      </button>
                      <button
                        className="markdown-page__annotation-action"
                        onClick={() => setEditingAnnotationId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="markdown-page__annotation-text">
                      {annotation.text}
                    </div>
                    <div className="markdown-page__annotation-preview">
                      "{annotation.selectedText}"
                    </div>
                    <div className="markdown-page__annotation-date">
                      {formatDate(annotation.timestamp)}
                    </div>
                    <div className="markdown-page__annotation-actions">
                      <button
                        className="markdown-page__annotation-action"
                        onClick={() => handleSuggestEdit(annotation)}
                      >
                        Suggest Edit
                      </button>
                      <button
                        className="markdown-page__annotation-action"
                        onClick={() => setEditingAnnotationId(annotation.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="markdown-page__annotation-action"
                        onClick={() => handleDeleteAnnotation(annotation.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* New Annotation Input */}
          {showAnnotationInput && (
            <div
              className="markdown-page__annotation-input"
              style={{
                position: annotationInputTop !== null ? 'absolute' : 'relative',
                left: '16px',
                right: '16px',
                top: annotationInputTop !== null ? `${annotationInputTop}px` : 'auto',
                zIndex: 40
              }}
            >
              <textarea
                ref={annotationInputRef}
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Add your annotation..."
              />
              <div className="markdown-page__annotation-input-actions">
                <button
                  onClick={handleCreateAnnotation}
                  disabled={!annotationText.trim()}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAnnotationInput(false);
                    setAnnotationText('');
                    setSelectedText('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Import/Export Actions */}
          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <button
              className="markdown-page__annotation-action"
              onClick={handleExportAnnotations}
              style={{ flex: 1 }}
            >
              Export
            </button>
            <button
              className="markdown-page__annotation-action"
              onClick={handleImportAnnotations}
              style={{ flex: 1 }}
            >
              Import
            </button>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default MarkdownPage;
