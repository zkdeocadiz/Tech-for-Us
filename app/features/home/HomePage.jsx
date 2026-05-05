import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './HomePage.css';

const featureIcon = 'https://www.figma.com/api/mcp/asset/4fd5c91c-08f2-495e-9015-86c7d517aab3';
const heroLogo = 'https://www.figma.com/api/mcp/asset/9512459b-36f1-4949-9572-fe0decf7dbfa';

const features = [
  {
    title: 'Activities',
    body: 'This isn’t a passive reading exercise. Get hands-on practice through active exercises for all content.',
  },
  {
    title: 'Annotations',
    body: 'You can annotate every post or activity, because everything should adapt to what you need.',
  },
  {
    title: 'Private',
    body: 'Everything is only saved onto your computer - no data in the cloud and nothing sent to us unless you want us to see it.',
  },
  {
    title: 'Co-created',
    body: 'See something you think should be changed? Submit a change because Tech for Us is driven by the community.',
  },
];

const activityCards = [
  { title: 'How to write a better dating app', text: 'lorem ipsum', tone: 'white', href: '/#activities' },
  { title: 'Value-based design', text: 'lorem ipsum', tone: 'pink', href: '/#activities' },
  { title: 'Groupchat', text: 'lorem ipsum', tone: 'blue', href: '/#activities' },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <Header />

      <main>
        <section className="home-hero home-page__section" id="manifesto">
          <div className="home-page__shell">
            <img className="home-hero__logo" src={heroLogo} alt="Tech for Us" />
            <p className="home-hero__copy">
              A <em>co-created toolkit</em> for helping you figure out what role technology should have in your life and how to get there
            </p>
            <a className="home-button" href="#activities">
              The Manifesto
            </a>
          </div>
        </section>

        <section className="home-features home-page__section" aria-labelledby="features-heading">
          <div className="home-page__shell">
            <h1 className="sr-only" id="features-heading">
              Tech for Us
            </h1>
            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <img className="feature-card__icon" src={featureIcon} alt="" aria-hidden="true" />
                  <h2 className="feature-card__title">{feature.title}</h2>
                  <p className="feature-card__body">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="activities home-page__section" id="activities" aria-labelledby="activities-heading">
          <div className="home-page__shell">
            <h2 className="home-section-title" id="activities-heading">
              Newest Activities
            </h2>

            <div className="activities__grid">
              <a className="activity-link activity-link--feature" href="/quiz" aria-label="Open What’s your technology type activity">
                <article className="activity-feature">
                  <div className="activity-feature__visual" />
                  <div className="activity-feature__content">
                    <h3 className="activity-feature__title">What’s your technology type?</h3>
                    <p className="activity-feature__text">lorem ipsum</p>
                  </div>
                </article>
              </a>

              {activityCards.map((card) => (
                <a className="activity-link" href={card.href} key={card.title} aria-label={`Open ${card.title} activity`}>
                  <article className="activity-card">
                    <div className={`activity-card__visual activity-card__visual--${card.tone}`} />
                    <div className="activity-card__body">
                      <h3 className="activity-card__title">{card.title}</h3>
                      <p className="activity-card__text">{card.text}</p>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="tracks home-page__section" id="tracks" aria-labelledby="tracks-heading">
          <div className="home-page__shell">
            <h2 className="home-section-title" id="tracks-heading">
              Curriculum Tracks
            </h2>
            <p className="tracks__text">Coming Soon</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}