import { Link } from 'react-router-dom';
import { loadResult } from '../features/quiz/storage';
import './chrome.css';

export default function Header() {
  const hasResult = !!loadResult();
  const navItems = [
    { label: 'Personality Quiz', to: hasResult ? '/technology-types' : '/quiz' },
    { label: 'All Activities', to: '/#activities' },
    { label: 'Your Content', to: '/#content' },
  ];

  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link className="site-logo-link" to="/" aria-label="Tech for Us home">
          <img className="site-logo" src="https://www.figma.com/api/mcp/asset/52706c78-1f88-4ac6-971b-e14e57cdde26" alt="Tech for Us" />
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.label} className="site-nav__item" to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}