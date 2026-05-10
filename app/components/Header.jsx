import { Link } from 'react-router-dom';
import { loadResult } from '../features/quiz/storage';
import './chrome.css';
import { useState, useEffect } from 'react';

export default function Header() {
  const [hasResult, setHasResult] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setHasResult(!!loadResult());

    const onStorage = (e) => {
      // If quiz result keys change, refresh our state so menu updates live
      if (!e) return;
      const key = e.key;
      if (!key) return;
      if (key === 'socialtech_quiz_result' || key.startsWith('quiz-')) {
        setHasResult(!!loadResult());
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const techTypePath = hasResult ? '/technology-types' : '/quiz';

  const navItems = [
    { label: 'Your Content', to: '/your-content' },
    { label: 'Activities', to: '/activities' },
    { label: 'Your Technology Type', to: techTypePath },
  ];

  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link className="site-logo-link" to="/" aria-label="Tech for Us home">
          <img className="site-logo" src="Header/Logo.svg" alt="Tech for Us" />
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => {
            if (item.label !== 'Your Technology Type') {
              return (
                <Link key={item.label} className="site-nav__item" to={item.to}>
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                key={item.label}
                className="site-nav__item site-nav__dropdown"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                style={{ position: 'relative' }}
              >
                <Link className="site-nav__item" to={item.to}>
                  {item.label}
                </Link>

                <div
                  className="site-nav__dropdown-menu"
                  aria-hidden={!dropdownOpen}
                  style={{
                    display: dropdownOpen ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.12)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                    padding: '0.25rem 0',
                    minWidth: '180px',
                    zIndex: 1000,
                  }}
                >
                  <Link
                    to={hasResult ? '/quiz/results' : '/quiz'}
                    className="site-nav__dropdown-item"
                    style={{ display: 'block', padding: '0.5rem 1rem', color: '#111' }}
                  >
                    {hasResult ? 'Your Type' : 'Take the Quiz'}
                  </Link>

                  <Link
                    to="/technology-types"
                    className="site-nav__dropdown-item"
                    style={{ display: 'block', padding: '0.5rem 1rem', color: '#111' }}
                  >
                    About the Types
                  </Link>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}