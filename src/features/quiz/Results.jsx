import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { loadResult, clearResult } from './storage';
import ScoreVisualization from './ScoreVisualization';

const F_SUBTYPE_LABELS = {
  Ft: 'Tracked',
  Fp: 'Polished',
};

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [markdown, setMarkdown] = useState('');
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
    ? stored.code.replace('F', stored.fSubtype)  // e.g. EPFC → EPFtC or EPFpC
    : stored.code;                                // e.g. EPGC → EPGC (unchanged)

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

  const handleRetake = () => {
    clearResult();
    navigate('/quiz');
  };

  if (loading) return <div className="results-loading">Loading your results...</div>;
  if (error) return <div className="results-error">{error}</div>;

  return (
    <div className="results">
      <div className="result-header">
        <span className="result-code">
          Your type: <strong>{result.code}</strong>
        </span>
        {result.fSubtype && (
          <span className="result-subtype">
            — Identity: {F_SUBTYPE_LABELS[result.fSubtype]}
          </span>
        )}
      </div>

      <ScoreVisualization scores={result.scores} fSubtype={result.fSubtype} />

      <article className="result-content">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </article>

      <button className="retake-button" onClick={handleRetake}>
        Retake Quiz
      </button>
    </div>
  );
}