import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { activities } from '../../components/activitiesData';
import './HomePage.css';
import '../../App.css';
import { Link } from 'react-router-dom';

const heroLogo = '/HomePage/Header.png';

const features = [
  {
    image: '/HomePage/activities.png',
    title: 'Activities',
    body: 'This isn’t a passive reading exercise. Get hands-on practice through active exercises for all content.',
  },
  {
    image: '/HomePage/annotations.png',
    title: 'Annotations',
    body: 'You can annotate every post or activity, because everything should adapt to what you need.',
  },
  {
    image: '/HomePage/private.png',
    title: 'Private',
    body: 'Everything is only saved onto your computer - no data in the cloud and nothing sent to us unless you want us to see it.',
  },
  {
    image: '/HomePage/co-created.png',
    title: 'Co-Created',
    body: 'See something you think should be changed? Submit a change because Tech for Us is driven by the community.',
  },
];

// Get most recent activities sorted by publishedDate
const activityCards = activities
  .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
  .slice(0, 3)
  .map((activity) => ({
    title: activity.title,
    text: activity.description,
    tone: activity.tone,
    href: activity.href,
    coverImage: activity.coverImage,
  }));

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
            <Link className="home-button" to="/content/Positionality">
              Why does this exist?
            </Link>
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
                  <img className="feature-card__icon" src={feature.image} alt="" aria-hidden="true" />
                  <h2 className="feature-card__title">{feature.title}</h2>
                  <p className="feature-card__body">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="activities home-page__section" id="activities" aria-labelledby="activities-heading">
          <div className="home-page__shell">
            

            <div className="activities__grid">
              <a className="activity-link activity-link--feature" href="/quiz" aria-label="Open What’s your technology type activity">
                <article className="activity-feature">
                  <div className="activity-feature__visual">
                  </div>
                  <div className="activity-feature__content">
                    <h3 className="activity-feature__title">What’s your technology type?</h3>
                    <p className="activity-feature__text">Learn what you need to survive in a world with social media</p>
                  </div>
                </article>
              </a>
            </div>

            <h2 id="activities-heading">
              Newest Activities
            </h2>

            <div className="activities__grid">

              {activityCards.map((card) => (
                <a className="activity-link" href={card.href} key={card.title} aria-label={`Open ${card.title} activity`}>
                  <article className="activity-card">
                    <div className={`activity-card__visual activity-card__visual--${card.tone}`}>
                      <img className="activity-card__cover" src={card.coverImage} alt="" aria-hidden="true" />
                    </div>
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

        {/* <section className="tracks home-page__section" id="tracks" aria-labelledby="tracks-heading">
          <div className="home-page__shell">
            <h2 id="tracks-heading">
              Curriculum Tracks
            </h2>
            <p className="tracks__text">Coming Soon</p>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  );
}