import { useState, useEffect, isValidElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { loadResult, clearResult } from './storage';
import ScoreVisualization from './ScoreVisualization';
import MarkdownPage from '../content/MarkdownPage';

const F_SUBTYPE_LABELS = {
  Ft: 'Tracked',
  Fp: 'Polished',
};

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [resultFileId, setResultFileId] = useState('default-page');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = loadResult();
    if (!stored) {
      navigate('/quiz');
      return;
    }

    setResult(stored);

    const filename = stored.fSubtype
      ? stored.code.replace('F', stored.fSubtype)  // e.g. EPFC -> EPFtC or EPFpC
      : stored.code;                                // e.g. EPGC -> EPGC (unchanged)

    setResultFileId(filename);

    const resultsPath = `${import.meta.env.BASE_URL}results/${filename}.md`;

    fetch(resultsPath)
      .then(res => {
        if (!res.ok) throw new Error(`No result file found for type ${stored.code}`);
        return res.text();
      })
      .then(text => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  const handleResetQuiz = () => {
    clearResult();
    navigate('/quiz');
  };

  if (loading) return <div className="results-loading">Loading your results...</div>;
  if (error) return <div className="results-error">{error}</div>;

  const markdownComponents = {
    ul: ({ children }) => (
      <ul
        style={{
          padding: '4px',
          backgroundColor: 'var(--color-yellow)',
          display: 'inline-block'
        }}
      >
        {children}
      </ul>
    ),
    p: ({ children, renderHighlightedNode }) => {
      const childrenToText = (node) => {
        const arr = Array.isArray(node) ? node : [node];
        return arr.map(child => {
          if (typeof child === 'string') return child;
          if (isValidElement(child)) return childrenToText(child.props.children);
          return '';
        }).join('');
      };

      const text = childrenToText(children).trim();
      const hasResultBarsToken = /\[\[\s*RESULT_BARS\s*\]\]/i.test(text);
      const hasMoreButtonsToken = /\[\[\s*MORE_TECH_TYPES_BUTTONS\s*\]\]/i.test(text);

      if (hasResultBarsToken) {
        return (
          <div>
            <ScoreVisualization scores={result.scores} fSubtype={result.fSubtype} showTitle={false} />
          </div>
        );
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
            <button
              onClick={handleResetQuiz}
              className="markdown-page__resource-button"
            >
              Reset quiz
            </button>
          </div>
        );
      }

      return <p>{renderHighlightedNode ? renderHighlightedNode(children, 'p-results') : children}</p>;
    }
  };

  const resultHeader = `Your type: ${result.code}${result.fSubtype ? ` - Identity: ${F_SUBTYPE_LABELS[result.fSubtype]}` : ''}`;
  const hasMoreSection = markdown.includes('[[MORE_TECH_TYPES_BUTTONS]]');
  const moreSection = `\n\n## More about technology types\n\n[[MORE_TECH_TYPES_BUTTONS]]\n`;
  const contentWithHeader = `${resultHeader}\n\n${markdown}${hasMoreSection ? '' : moreSection}`;

  return (
    <MarkdownPage
      content={contentWithHeader}
      pageId={`results-${resultFileId}`}
      markdownComponents={markdownComponents}
    />
  );
}