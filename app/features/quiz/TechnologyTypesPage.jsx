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

  const userType = ALL_TYPES.find(t => t.code === highlightedCode);
  const gridTypes = highlightedCode 
    ? ALL_TYPES.filter(t => t.code !== highlightedCode)
    : ALL_TYPES;

  return (
    <div className="types-page">
      <Header />
      <main className="types-main">
          <div className="types-header">
            <p className="quiz-kicker">What&rsquo;s your</p>
            <h1 className="quiz-heading" id="quiz-heading">
              Technology Type?
            </h1>
          </div>
          
        <p className="types-subtitle">Billions of people use social tech to stay connected to each other... but we all have our own personal relationship with it. Technology Types are a way to explore that relationship, to help you figure out ways to survive in an increasingly technology-driven world.</p>

        <Link to="/content/Categories" className="quiz-button" aria-describedby="quiz-heading">learn about the dimensions</Link>

        {userType && (
          <section className="types-featured">
            {/* <h2 className="types-featured__title">Your Technology Type</h2> */}
            <Link to={`/content/${userType.code}`} className="types-featured-link">
              <article className="types-featured-card">
                <img src={`/Quiz/results/images/${userType.code}.png`} alt="" aria-hidden="true" className="types-featured__image" />
                <div className="types-featured__content">
                  <p className="types-featured__code">You are</p>
                  <h3 className="types-featured__name">{typeNames[userType.code] || userType.code}</h3>
                  <p className="types-featured__code">{userType.code}</p>
                  <p className="types-featured__labels">{userType.labels.join(', ')}</p>
                </div>
              </article>
            </Link>
            <Link to="/quiz" className="types-retake">Not right? Retake the quiz</Link>
          </section>
        )}

        <h2>All Technology Types</h2>

        <div className="types-grid">
          {gridTypes.map(type => {
            const typeName = typeNames[type.code];
            return (
              <Link key={type.code} to={`/content/${type.code}`} className="types-card-link">
                <article className="types-card">
                  <img src={`/Quiz/results/images/${type.code}.png`} alt="" aria-hidden="true" className="types-card__image" />
                  <div className="types-card__content">
                    <h3 className="types-card__name">{typeName || type.code}</h3>
                    <p className="types-card__code">{type.code}</p>
                    <p className="types-card__labels">{type.labels.join(', ')}</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
        <div className="types-method">
          <h2>Method</h2>
          <p>A selection of frustrations with technology were collected from a range of sources, including social media, research papers, and media outlets. These frustrations were sorted categorically to create the different dimensions. From there, speculative design methods were used to explore what types of people the Technology Types might represent.</p>

          <p>I tested it with the Open Project: Experimental Infrastructures class at Harvard GSD, and I’m especially grateful to all the reviewers who gave feedback and advice... especially the folks who told me this was an interesting idea and I should pursue it.</p>

          <p>All of the illustrations were drawn by me in Procreate, with only occasional drawing references taken by me or from stock photo sites.</p>

          <h3>AI Statement</h3>
          <p>ChatGPT 5.1 was used:</p>
          <ul>
            <li>to ideate on titles for each of the Technology Types</li>
            <li>suggesting names for the dimensions based on the descriptions of them, to explore word combinations that sounded good as a string when shortened to initials for the Technology Type codes</li>
            <li>to shorten written descriptions, with explicit instructions to keep as much of the original phrasing as possible</li>
            <li>to generate code to make the quiz work</li>
            <li>to generate engineering templates for each of the pages (i.e. copy and pasting)</li>
            <li>to research alternate social media platforms, as it is increasingly difficult to use search engines to find information</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
