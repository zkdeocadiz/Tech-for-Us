import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Quiz from './features/quiz/Quiz';
import Results from './features/quiz/Results';
import TechnologyTypesPage from './features/quiz/TechnologyTypesPage';
import HomePage from './features/home/HomePage';
import MarkdownPage from './features/content/MarkdownPage';
import ScoreVisualization from './features/quiz/ScoreVisualization';
import { loadResult } from './features/quiz/storage';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isValidElement } from 'react';

function MarkdownPageLoader() {
  const { pageId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storedResult = loadResult();
  const resultPageId = storedResult
    ? (storedResult.fSubtype
      ? storedResult.code.replace('F', storedResult.fSubtype)
      : storedResult.code)
    : null;

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build paths to try - prioritize results folder
        const paths = [
          `/results/${pageId}.md`,
          `/${pageId}.md`,
        ];

        let success = false;
        let text = '';

        for (const path of paths) {
          try {
            const response = await fetch(path, { headers: { 'Accept': 'text/plain' } });
            if (response.ok) {
              text = await response.text();
              // Verify it's actually markdown and not HTML
              if (text && !text.trim().startsWith('<!DOCTYPE')) {
                success = true;
                break;
              }
            }
          } catch (e) {
            // Continue to next path
            console.error(`Failed to fetch ${path}:`, e);
            continue;
          }
        }

        if (!success) {
          throw new Error(`Could not find markdown file for "${pageId}". Make sure ${pageId}.md exists in /public/results/ or /public/`);
        }

        console.log('Loaded markdown content:', text.substring(0, 100));
        setContent(text);
      } catch (err) {
        console.error('Markdown load error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [pageId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-pale-pink)', color: 'var(--color-blue)', fontFamily: 'Inclusive Sans, sans-serif', fontSize: '20px' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-pale-pink)', color: 'var(--color-blue)', fontFamily: 'Inclusive Sans, sans-serif', fontSize: '20px' }}>
        Error: {error}
      </div>
    );
  }

  const isTechnologyTypePage = /^[EW][DM](G|FT|FP)[CL]$/i.test(pageId);
  const hasMoreSection = /\[\[\s*MORE_TECH_TYPES_BUTTONS\s*\]\]/i.test(content);
  const moreSection = `\n\n## More about technology types\n\n[[MORE_TECH_TYPES_BUTTONS]]\n`;
  const contentWithMore = isTechnologyTypePage && !hasMoreSection ? `${content}${moreSection}` : content;

  const markdownComponents = {
    p: ({ children, renderHighlightedNode }) => {
      const childrenToText = (node) => {
        const arr = Array.isArray(node) ? node : [node];
        return arr
          .map((child) => {
            if (typeof child === 'string') return child;
            if (isValidElement(child)) return childrenToText(child.props.children);
            return '';
          })
          .join('');
      };

      const text = childrenToText(children).trim();
      const hasResultBarsToken = /\[\[\s*RESULT_BARS\s*\]\]/i.test(text);
      const hasMoreButtonsToken = /\[\[\s*MORE_TECH_TYPES_BUTTONS\s*\]\]/i.test(text);

      if (hasResultBarsToken) {
        const isMatchingResultPage =
          !!storedResult && !!resultPageId && pageId.toUpperCase() === resultPageId.toUpperCase();

        if (isMatchingResultPage) {
          return <ScoreVisualization scores={storedResult.scores} fSubtype={storedResult.fSubtype} showTitle={false} />;
        }

        // Suppress raw token text on non-matching type pages.
        return null;
      }

      if (hasMoreButtonsToken) {
        return (
          <div className="markdown-page__resource-actions">
            <Link
              to="/technology-types"
              className="markdown-page__resource-button"
            >
              View all technology types
            </Link>
            <Link
              to="/content/Categories"
              className="markdown-page__resource-button"
            >
              Read what the categories mean
            </Link>
            <Link
              to={storedResult ? '/quiz/results' : '/quiz'}
              className="markdown-page__resource-button"
            >
              View your result
            </Link>
          </div>
        );
      }

      return <p>{renderHighlightedNode ? renderHighlightedNode(children, 'p-content') : children}</p>;
    }
  };

  return <MarkdownPage content={contentWithMore} pageId={pageId} markdownComponents={markdownComponents} />;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/results" element={<Results />} />
        <Route path="/technology-types" element={<TechnologyTypesPage />} />
        <Route path="/content/:pageId" element={<MarkdownPageLoader />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}