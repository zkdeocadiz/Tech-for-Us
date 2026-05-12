import './chrome.css';

const defaultFooterColumns = [
  {
    title: 'Activities',
    items: [
      { label: 'All Activities', href: '/activities' },
      // { label: 'Activity Sets', href: '/activity-sets' },
      { label: 'Alternative Social Tech', href: '/alternative-social-tech' },
    ],
  },
  {
    title: 'Your Content',
    items: [
      { label: 'View All', href: '/your-content' },
      { label: 'Technology Type Quiz', href: '/quiz' },
      // { label: 'Privacy', href: '/content/Privacy' },
    ],
  },
  {
    title: 'Tech for Us',
    items: [
      { label: 'Manifesto', href: '/content/Manifesto' },
      // { label: 'Contributors', href: '/contributors' },
      { label: 'Github', href: 'https://github.com/zkdeocadiz/Tech-for-Us' },
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