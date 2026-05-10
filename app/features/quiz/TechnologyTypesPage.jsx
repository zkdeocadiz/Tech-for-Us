import { useEffect, useState } from 'react';
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
  Ft: 'filtered (tracked)',
  Fp: 'filtered (polished)',
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

const parseFrontmatter = (text) => {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return {};

  return match[1].split('\n').reduce((acc, line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) return acc;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key) acc[key] = value;
    return acc;
  }, {});
};

export default function TechnologyTypesPage() {
  const stored = loadResult();
  const highlightedCode = stored
    ? (stored.fSubtype ? stored.code.replace('F', stored.fSubtype) : stored.code)
    : null;
  const [typeNames, setTypeNames] = useState({});

  useEffect(() => {
    let cancelled = false;

    const loadTypeNames = async () => {
      const entries = await Promise.all(
        ALL_TYPES.map(async (type) => {
          try {
            const response = await fetch(`/Quiz/results/${type.code}.md`, { headers: { Accept: 'text/plain' } });
            if (!response.ok) return [type.code, ''];

            const text = await response.text();
            const metadata = parseFrontmatter(text);
            return [type.code, metadata.name || ''];
          } catch {
            return [type.code, ''];
          }
        })
      );

      if (!cancelled) {
        setTypeNames(Object.fromEntries(entries));
      }
    };

    loadTypeNames();

    return () => {
      cancelled = true;
    };
  }, []);

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
            const typeName = typeNames[type.code];
            return (
              <article key={type.code} className={`types-card ${isActive ? 'active' : ''}`}>
                <h2>{typeName || type.code}</h2>
                <p className="types-code">{type.code}</p>
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
