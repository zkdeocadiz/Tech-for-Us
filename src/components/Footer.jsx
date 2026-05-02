import './chrome.css';

const defaultFooterColumns = [
  {
    title: 'Activities',
    items: [
      { label: 'All Activities', href: '/#activities' },
      { label: 'Suggested Activity Sets', href: '/#activities' },
      { label: 'Alternative social media', href: '/alternativesocialtech/Platforms.md' },
    ],
  },
  {
    title: 'Your Content',
    items: [
      { label: 'Technology Type Quiz', href: '/quiz' },
      { label: 'All Annotated Works', href: '/#content' },
      { label: 'Privacy', href: '/#privacy' },
    ],
  },
  {
    title: 'Tech for Us',
    items: [
      { label: 'About Tech for Us', href: '/#about' },
      { label: 'Manifesto', href: '/#manifesto' },
      { label: 'Github', href: 'https://github.com/' },
    ],
  },
];

export default function Footer({ columns = defaultFooterColumns }) {
  return (
    <footer className="site-footer" id="content">
      <div className="site-shell site-footer__inner">
        {columns.map((column) => (
          <section key={column.title}>
            <h2 className="site-footer__title">{column.title}</h2>
            <ul className="site-footer__list">
              {column.items.map((item) => (
                <li key={item.label}>
                  <a className="site-footer__link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </footer>
  );
}