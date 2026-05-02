import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { loadResult } from './storage';
import './TechnologyTypesPage.css';

const AXIS = {
  E: 'energized',
  W: 'weary',
  D: 'desired',
  M: 'mandatory',
  G: 'genuine',
  Ft: 'tracked',
  Fp: 'polished',
  C: 'connected',
  L: 'lonely',
};

const MENTAL = ['E', 'W'];
const SOCIAL = ['D', 'M'];
const IDENTITY = ['G', 'Ft', 'Fp'];
const CONNECTION = ['C', 'L'];

const ALL_TYPES = MENTAL.flatMap(m =>
  SOCIAL.flatMap(s =>
    IDENTITY.flatMap(i =>
      CONNECTION.map(c => ({ code: `${m}${s}${i}${c}`, labels: [AXIS[m], AXIS[s], AXIS[i], AXIS[c]] }))
    )
  )
);

export default function TechnologyTypesPage() {
  const stored = loadResult();
  const highlightedCode = stored
    ? (stored.fSubtype ? stored.code.replace('F', stored.fSubtype) : stored.code)
    : null;
  const orderedTypes = [...ALL_TYPES].sort((a, b) => {
    if (a.code === highlightedCode) return -1;
    if (b.code === highlightedCode) return 1;
    return 0;
  });

  return (
    <div className="types-page">
      <Header />
      <main className="types-main">
        <h1 className="types-title">All Technology Types</h1>
        <p className="types-subtitle">Browse all cards and compare where your current result sits.</p>

        <div className="types-grid">
          {orderedTypes.map(type => {
            const isActive = highlightedCode === type.code;
            return (
              <article key={type.code} className={`types-card ${isActive ? 'active' : ''}`}>
                <h2>{type.code}</h2>
                <p>{type.labels.join(', ')}</p>
                <Link className="types-link" to={`/content/${type.code}`}>
                  View card
                </Link>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
