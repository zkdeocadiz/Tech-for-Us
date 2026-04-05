import './ScoreVisualization.css';
import { QUESTION_COUNTS } from './questions';

const CATEGORY_CONFIG = [
  {
    id: 'mentalHealth',
    name: 'Mental Health',
    left:  { letter: 'E', label: 'Energized' },
    right: { letter: 'W', label: 'Weary' },
    getAverages: (scores) => ({
      left:  scores.mentalHealth.E / QUESTION_COUNTS.mentalHealth.E,
      right: scores.mentalHealth.W / QUESTION_COUNTS.mentalHealth.W,
    }),
  },
  {
    id: 'socialStatus',
    name: 'Social Status',
    left:  { letter: 'D', label: 'Desired' },
    right: { letter: 'M', label: 'Mandatory' },
    getAverages: (scores) => ({
      left:  scores.socialStatus.D / QUESTION_COUNTS.socialStatus.D,
      right: scores.socialStatus.M / QUESTION_COUNTS.socialStatus.M,
    }),
  },
  {
    id: 'identity',
    name: 'Identity',
    left:  { letter: 'G', label: 'Genuine' },
    right: { letter: 'F', label: 'Filtered' },
    getAverages: (scores) => {
      const fTotal = scores.identity.Ft + scores.identity.Fp;
      const fCount = QUESTION_COUNTS.identity.Ft + QUESTION_COUNTS.identity.Fp;
      return {
        left:  scores.identity.G / QUESTION_COUNTS.identity.G,
        right: fTotal / fCount,
      };
    },
  },
  {
    id: 'connection',
    name: 'Connection',
    left:  { letter: 'C', label: 'Connected' },
    right: { letter: 'L', label: 'Lonely' },
    getAverages: (scores) => ({
      left:  scores.connection.C / QUESTION_COUNTS.connection.C,
      right: scores.connection.L / QUESTION_COUNTS.connection.L,
    }),
  },
];

const F_SUBTYPE_CONFIG = {
  name: 'Within Fake: Tracked vs. Polished',
  left:  { letter: 'Ft', label: 'Tracked' },
  right: { letter: 'Fp', label: 'Polished' },
  getAverages: (scores) => ({
    left:  scores.identity.Ft / QUESTION_COUNTS.identity.Ft,
    right: scores.identity.Fp / QUESTION_COUNTS.identity.Fp,
  }),
};

function SpectrumBar({ left, right, leftAvg, rightAvg }) {
  const total = leftAvg + rightAvg;
  const rawPosition = total === 0 ? 50 : (rightAvg / total) * 100;
  // Clamp so the indicator circle always stays visible within the bar
  const indicatorPosition = Math.max(5, Math.min(95, rawPosition));
  const leansLeft = leftAvg >= rightAvg;

  return (
    <div className="viz-spectrum-item">
      <div className="viz-labels">
        <span className={`viz-label viz-label--left${leansLeft ? ' viz-label--active' : ''}`}>
          <span className="viz-letter">{left.letter}</span>
          <span className="viz-name">{left.label}</span>
        </span>
        <span className={`viz-label viz-label--right${!leansLeft ? ' viz-label--active' : ''}`}>
          <span className="viz-name">{right.label}</span>
          <span className="viz-letter">{right.letter}</span>
        </span>
      </div>
      <div
        className="viz-bar"
        role="img"
        aria-label={`Score leans toward ${leansLeft ? left.label : right.label}`}
      >
        <div
          className="viz-indicator"
          style={{ left: `${indicatorPosition}%` }}
        />
      </div>
    </div>
  );
}

export default function ScoreVisualization({ scores, fSubtype }) {
  const fSubtypeAverages = F_SUBTYPE_CONFIG.getAverages(scores);

  return (
    <div className="score-visualization">
      <h2 className="viz-title">Score Breakdown</h2>
      <div className="viz-category-list">
        {CATEGORY_CONFIG.map(cat => {
          const { left: leftAvg, right: rightAvg } = cat.getAverages(scores);
          return (
            <div key={cat.id} className="viz-category">
              <h3 className="viz-category-name">{cat.name}</h3>
              <SpectrumBar
                left={cat.left}
                right={cat.right}
                leftAvg={leftAvg}
                rightAvg={rightAvg}
              />
              {cat.id === 'identity' && fSubtype && (
                <div className="viz-subtype">
                  <p className="viz-subtype-label">{F_SUBTYPE_CONFIG.name}</p>
                  <SpectrumBar
                    left={F_SUBTYPE_CONFIG.left}
                    right={F_SUBTYPE_CONFIG.right}
                    leftAvg={fSubtypeAverages.left}
                    rightAvg={fSubtypeAverages.right}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}