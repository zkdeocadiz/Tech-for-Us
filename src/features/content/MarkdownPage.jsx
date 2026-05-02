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

const MarkdownPage = ({ content = '', pageId = 'default-page', title = 'Content', markdownComponents = {} }) => {
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
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [suggestionData, setSuggestionData] = useState({
    annotationText: '',
    selectedText: '',
    creditName: '',
    creditLink: '',
    pageId: pageId,
    pagePath: `results/${pageId}.md`
  });
  const WORKER_URL = 'https://hidden-thunder-0974.makingtechforus.workers.dev';
  const contentRef = useRef(null);
  const annotationRefsMap = useRef({});
  const annotationsRef = useRef(null);
  const annotationsListRef = useRef(null);
  const [annotationInputTop, setAnnotationInputTop] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [mobileModalPos, setMobileModalPos] = useState({ top: 0, position: 'above' });
  const annotationInputRef = useRef(null);
  
  // Store current selection without triggering state updates that would clear it
  const selectionRef = useRef({ text: '', range: null, top: 0 });
  const [inputVisible, setInputVisible] = useState(false);

  // Load annotations from localStorage on mount
  useEffect(() => {
    const savedAnnotations = annotationStorage.getPageAnnotations(pageId);
    // Sort by text position so they appear in order
    const sorted = savedAnnotations.sort((a, b) => (a.textPosition || 0) - (b.textPosition || 0));
    setAnnotations(sorted);
  }, [pageId]);

  // Monitor screen size for mobile responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 850);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Handle text selection in content area WITHOUT triggering state updates
  // State updates cause React re-renders that clear the browser selection
  useEffect(() => {
    let timeoutId;
    
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const selected = selection.toString().trim();

      if (selected && contentRef.current) {
        try {
          const range = selection.getRangeAt(0);
          const isInContent = contentRef.current.contains(range.commonAncestorContainer);
          
          if (isInContent) {
            const rect = range.getBoundingClientRect();
            const contentRect = contentRef.current.getBoundingClientRect();
            const relativeTop = rect.top - contentRect.top;
            
            // Always update ref with new selection
            selectionRef.current = { text: selected, range: range.cloneRange(), top: relativeTop };
            
            // Delay state updates long enough for selection to stabilize
            // This prevents React's re-render from invalidating the selection
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              setSelectedText(selected);
              if (!inputVisible) {
                setAnnotationText('');
                setInputVisible(true);
                setFocusedAnnotationId(null);
              }
            }, 150);
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
        clearTimeout(timeoutId);
      };
    }
  }, [inputVisible]);

  // Handle clicking away to deselect/close annotations
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the user is currently selecting text, don't deselect anything
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.toString().trim()) {
        return;
      }

      // Check if the click target is an annotated text highlight, 
      // an annotation card, or the new annotation input
      const isHighlight = event.target.closest('.markdown-page__annotated-text');
      const isAnnotationCard = event.target.closest('.markdown-page__annotation-card');
      const isInputModal = annotationInputRef.current?.contains(event.target);
      const isMobileModal = event.target.closest('.markdown-page__mobile-context-modal');

      if (!isHighlight && !isAnnotationCard && !isInputModal && !isMobileModal) {
        setFocusedAnnotationId(null);
        setEditingAnnotationId(null);
        if (inputVisible) {
          setInputVisible(false);
          setAnnotationText('');
          setSelectedText('');
          selectionRef.current = { text: '', range: null, top: 0 };
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputVisible]);

  // Calculate mobile modal position based on selection or focused annotation
  useEffect(() => {
    if (!isMobile) return;
    
    let targetRect = null;
    if (inputVisible && selectionRef.current.range) {
      targetRect = selectionRef.current.range.getBoundingClientRect();
    } else if (focusedAnnotationId) {
      const el = document.querySelector(`.markdown-page__annotated-text[data-annotation-id="${focusedAnnotationId}"]`);
      if (el) targetRect = el.getBoundingClientRect();
    }

    if (targetRect) {
      const modalHeight = 180; // Estimated height for the mobile modal
      const margin = 12;
      const viewportHeight = window.innerHeight;
      
      // Determine if there is more space above or below the highlight
      const spaceAbove = targetRect.top;
      const spaceBelow = viewportHeight - targetRect.bottom;
      
      let top;
      let pos = 'above';
      
      // Prioritize space above if it fits, otherwise use the side with more room
      if (spaceAbove > spaceBelow && spaceAbove > modalHeight + margin) {
        top = Math.max(margin, targetRect.top - modalHeight - margin);
        pos = 'above';
      } else {
        top = Math.min(viewportHeight - modalHeight - margin, targetRect.bottom + margin);
        pos = 'below';
      }
      
      setMobileModalPos({ top, position: pos });
    }
  }, [isMobile, inputVisible, focusedAnnotationId, annotations]);

  // Compute absolute positions for saved annotations so they appear near highlighted text
  useEffect(() => {
    const computePositions = () => {
      if (isMobile || !contentRef.current || !annotationsListRef.current) return;
      
      const contentRect = contentRef.current.getBoundingClientRect();
      const listRect = annotationsListRef.current.getBoundingClientRect();
      const listScrollTop = annotationsListRef.current.scrollTop;

      const spacing = 12; // Gap between cards
      
      // 1. Gather all items to be positioned (annotations + input box)
      const items = annotations.map(a => {
        const el = annotationRefsMap.current[a.id];
        // The target position is right next to the highlighted text
        const targetY = (contentRect.top + (a.textPosition || 0)) - listRect.top + listScrollTop;
        return { 
          id: a.id, 
          type: 'annotation',
          targetY, 
          height: el ? el.getBoundingClientRect().height : 100,
          isFocused: a.id === focusedAnnotationId
        };
      });

      // Add new annotation input to the layout if visible
      if (inputVisible && selectionRef.current.top) {
        const targetY = (contentRect.top + selectionRef.current.top) - listRect.top + listScrollTop - 8;
        const inputEl = annotationInputRef.current;
        
        items.push({
          id: 'new-input',
          type: 'input',
          targetY,
          height: inputEl ? inputEl.getBoundingClientRect().height : 160,
          isFocused: true // Input always acts as a priority anchor
        });
      }

      if (items.length === 0) {
        setAnnotationPositions({});
        setAnnotationStackHeight(0);
        setAnnotationInputTop(null);
        return;
      }

      // Sort items by targetY to ensure they follow document order
      items.sort((a, b) => a.targetY - b.targetY);

      // 2. Resolve collisions using the "Fixed Anchor" logic
      // Preference: Input Modal > Focused Annotation
      let anchorIndex = items.findIndex(item => item.type === 'input');
      if (anchorIndex === -1) {
        anchorIndex = items.findIndex(item => item.isFocused);
      }

      const positioned = [...items];
      
      if (anchorIndex !== -1) {
        // The anchor must be at its exact targetY
        positioned[anchorIndex].top = positioned[anchorIndex].targetY;

        // Push preceding items upwards if they overlap
        for (let i = anchorIndex - 1; i >= 0; i--) {
          const current = positioned[i];
          const below = positioned[i + 1];
          const maxTop = below.top - current.height - spacing;
          current.top = Math.min(current.targetY, maxTop);
        }

        // Push following items downwards if they overlap
        for (let i = anchorIndex + 1; i < positioned.length; i++) {
          const current = positioned[i];
          const above = positioned[i - 1];
          const minTop = above.top + above.height + spacing;
          current.top = Math.max(current.targetY, minTop);
        }
      } else {
        // No focus: simple top-down collision resolution
        positioned[0].top = positioned[0].targetY;
        for (let i = 1; i < positioned.length; i++) {
          const current = positioned[i];
          const above = positioned[i - 1];
          const minTop = above.top + above.height + spacing;
          current.top = Math.max(current.targetY, minTop);
        }
      }

      // 3. Update result states
      const finalAnnotationPositions = {};
      let finalInputTop = null;
      let totalStackHeight = 0;

      positioned.forEach(item => {
        if (item.type === 'annotation') {
          finalAnnotationPositions[item.id] = item.top;
        } else {
          finalInputTop = item.top;
        }
        totalStackHeight = Math.max(totalStackHeight, item.top + item.height + spacing);
      });

      setAnnotationPositions(finalAnnotationPositions);
      setAnnotationInputTop(finalInputTop);
      setAnnotationStackHeight(totalStackHeight);
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
  }, [annotations, focusedAnnotationId, inputVisible, editingAnnotationId, selectedText, isMobile]);

  // Note: Removed auto-focus on annotation input to preserve text selection
  // Users can click the input to start typing, and their selection remains visible for copying

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
      textPosition: selectionRef.current.top || 0
    };

    const updatedAnnotations = [...annotations, newAnnotation].sort((a, b) => a.textPosition - b.textPosition);
    setAnnotations(updatedAnnotations);
    annotationStorage.saveAnnotation(pageId, newAnnotation);

    // Reset form and keep focused on the new annotation
    setAnnotationText('');
    setSelectedText('');
    setInputVisible(false);
    setSelectedTextRange(null);
    selectionRef.current = { text: '', range: null, top: 0 };
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

  // Suggest public edit - open modal with editable suggestion
  const handleSuggestEdit = (annotation) => {
    setSuggestionData({
      annotationText: annotation.text || '',
      selectedText: annotation.selectedText || '',
      creditName: '',
      creditLink: '',
      pageId: pageId,
      pagePath: `results/${pageId}.md`
    });
    setShowSuggestionModal(true);
  };

  const submitSuggestion = async () => {
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestionData)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Worker error');
      }

      const json = await res.json();
      setShowSuggestionModal(false);
      alert(json.issueUrl ? `Suggestion submitted: ${json.issueUrl}` : 'Suggestion submitted');
    } catch (err) {
      console.error('Suggestion submit error', err);
      alert('Failed to submit suggestion. Check console for details.');
    }
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
                    const liveSelection = window.getSelection();
                    if (liveSelection && !liveSelection.isCollapsed && liveSelection.toString().trim()) {
                      return;
                    }
                    setFocusedAnnotationId(annotation.id);
                    setInputVisible(false); // Close new input if selecting existing
                    
                    if (!isMobile) {
                      const annotationElement = document.querySelector(`[data-annotation-ref="${annotation.id}"]`);
                      annotationElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
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

  const toTitleCaseString = (value) => {
    return value
      .toLowerCase()
      .replace(/\b([a-z])/g, (match) => match.toUpperCase());
  };

  const toTitleCaseNode = (node) => {
    if (typeof node === 'string') {
      return toTitleCaseString(node);
    }

    if (Array.isArray(node)) {
      return node.map((child) => toTitleCaseNode(child));
    }

    if (isValidElement(node)) {
      return cloneElement(node, node.props, toTitleCaseNode(node.props.children));
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

  const defaultMarkdownComponents = {
    p: ({ children }) => {
      return <p>{renderHighlightedNode(children, 'p')}</p>;
    },
    li: ({ children }) => <li>{renderHighlightedNode(children, 'li')}</li>,
    h1: ({ children }) => <h1>{renderHighlightedNode(toTitleCaseNode(children), 'h1')}</h1>,
    h2: ({ children }) => <h2>{renderHighlightedNode(children, 'h2')}</h2>,
    h3: ({ children }) => <h3>{renderHighlightedNode(children, 'h3')}</h3>,
    h4: ({ children }) => <h4>{renderHighlightedNode(children, 'h4')}</h4>,
    h5: ({ children }) => <h5>{renderHighlightedNode(children, 'h5')}</h5>,
    h6: ({ children }) => <h6>{renderHighlightedNode(children, 'h6')}</h6>,
  };

  const enhancedMarkdownComponents = Object.fromEntries(
    Object.entries(markdownComponents).map(([tag, renderer]) => {
      if (typeof renderer !== 'function') return [tag, renderer];
      return [
        tag,
        (props) => renderer({
          ...props,
          renderHighlightedNode,
          focusedAnnotationId,
        }),
      ];
    })
  );

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
          <ReactMarkdown components={{ ...defaultMarkdownComponents, ...enhancedMarkdownComponents }}>
            {content}
          </ReactMarkdown>
        </div>

        {/* Right Annotations Panel */}
        <aside 
          className="markdown-page__annotations" 
          ref={annotationsRef}
          style={isMobile ? { display: 'none' } : {}}
        >
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
                style={{ 
                  top: annotationPositions[annotation.id] !== undefined ? `${annotationPositions[annotation.id]}px` : undefined,
                  transition: 'top 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease, background-color 0.3s ease'
                }}
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
                        onClick={(e) => { e.stopPropagation(); handleSuggestEdit(annotation); }}
                      >
                        Suggest Edit
                      </button>
                      <button
                        className="markdown-page__annotation-action"
                        onClick={(e) => { e.stopPropagation(); setEditingAnnotationId(annotation.id); }}
                      >
                        Edit
                      </button>
                      <button
                        className="markdown-page__annotation-action"
                        onClick={(e) => { e.stopPropagation(); handleDeleteAnnotation(annotation.id); }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* New Annotation Input moved inside the list to share coordinate space */}
            {inputVisible && (
              <div
                ref={annotationInputRef}
                className="markdown-page__annotation-input"
                style={{
                  position: 'absolute',
                  left: '16px',
                  right: '16px',
                  top: annotationInputTop !== null ? `${annotationInputTop}px` : '0px',
                  zIndex: 40,
                  backgroundColor: 'var(--color-blue)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'top 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
              >
                {selectedText && (
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '6px', fontStyle: 'italic', maxHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{selectedText}"
                  </div>
                )}
                <textarea
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                  placeholder="Add your annotation..."
                  onFocus={(e) => e.currentTarget.focus()}
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
                      setInputVisible(false);
                      setAnnotationText('');
                      setSelectedText('');
                      selectionRef.current = { text: '', range: null, top: 0 };
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Suggestion Modal */}
          {showSuggestionModal && (
            <div
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
              onClick={() => setShowSuggestionModal(false)}
            >
              <div
                style={{ background: '#fff', color: '#111', padding: 20, borderRadius: 8, width: 'min(680px, 96%)', maxHeight: '80vh', overflow: 'auto' }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ marginTop: 0 }}>Submit Suggestion</h3>

                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Selected text</label>
                  <div style={{ background: '#f6f6f6', padding: 8, borderRadius: 4 }}>{suggestionData.selectedText}</div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Your suggestion</label>
                  <textarea
                    value={suggestionData.annotationText}
                    onChange={(e) => setSuggestionData({ ...suggestionData, annotationText: e.target.value })}
                    rows={6}
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    placeholder="Name (optional)"
                    value={suggestionData.creditName}
                    onChange={(e) => setSuggestionData({ ...suggestionData, creditName: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <input
                    placeholder="Link (optional)"
                    value={suggestionData.creditLink}
                    onChange={(e) => setSuggestionData({ ...suggestionData, creditLink: e.target.value })}
                    style={{ flex: 1 }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => setShowSuggestionModal(false)}>Cancel</button>
                  <button
                    onClick={submitSuggestion}
                    disabled={!suggestionData.annotationText.trim()}
                    style={{ background: 'var(--color-green)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4 }}
                  >
                    Submit
                  </button>
                </div>
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

      {/* Mobile Contextual Modal moved out of hidden sidebar */}
      {isMobile && (inputVisible || focusedAnnotationId) && (
        <div 
          className="markdown-page__mobile-context-modal"
          style={{
            position: 'fixed',
            top: `${mobileModalPos.top}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '400px',
            zIndex: 1000,
            backgroundColor: 'var(--color-blue)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white'
          }}
        >
          {inputVisible ? (
            <div className="markdown-page__annotation-input mobile">
              {selectedText && (
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontStyle: 'italic', maxHeight: '40px', overflow: 'hidden' }}>
                  "{selectedText}"
                </div>
              )}
              <textarea
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Add your annotation..."
                style={{ width: '100%', minHeight: '80px', marginBottom: '8px', borderRadius: '4px', border: 'none', padding: '8px', color: '#333' }}
              />
              <div className="markdown-page__annotation-input-actions" style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={handleCreateAnnotation}
                  style={{ flex: 1, backgroundColor: 'white', color: 'var(--color-blue)', border: 'none', borderRadius: '4px', padding: '8px', fontWeight: 'bold' }}
                >
                  Add
                </button>
                <button 
                  onClick={() => setInputVisible(false)}
                  style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '4px', padding: '8px' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            annotations.filter(a => a.id === focusedAnnotationId).map(annotation => (
              <div key={annotation.id}>
                {editingAnnotationId === annotation.id ? (
                  <>
                    <textarea
                      value={annotation.text}
                      onChange={(e) => {
                        setAnnotations(annotations.map(a =>
                          a.id === annotation.id ? { ...a, text: e.target.value } : a
                        ));
                      }}
                      style={{ width: '100%', minHeight: '80px', marginBottom: '8px', borderRadius: '4px', border: 'none', padding: '8px', color: '#333' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleUpdateAnnotation(annotation.id, annotation.text)} style={{ flex: 1, backgroundColor: 'white', color: 'var(--color-blue)', border: 'none', borderRadius: '4px', padding: '8px', fontWeight: 'bold' }}>Save</button>
                      <button onClick={() => setEditingAnnotationId(null)} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '4px', padding: '8px' }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: '8px', fontWeight: '500', lineHeight: '1.4' }}>{annotation.text}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '12px', fontStyle: 'italic' }}>"{annotation.selectedText}"</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => setEditingAnnotationId(annotation.id)}
                        style={{ backgroundColor: 'white', color: 'var(--color-blue)', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.85rem' }}
                      >Edit</button>
                      <button 
                        onClick={() => handleDeleteAnnotation(annotation.id)}
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '0.85rem' }}
                      >Delete</button>
                      <button 
                        onClick={() => setFocusedAnnotationId(null)}
                        style={{ marginLeft: 'auto', background: 'none', color: 'white', border: 'none', textDecoration: 'underline', fontSize: '0.85rem' }}
                      >Close</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MarkdownPage;
