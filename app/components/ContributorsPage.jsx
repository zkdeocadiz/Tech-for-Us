import Header from './Header';
import Footer from './Footer';

export default function ContributorsPage() {
  return (
    <div className="standard-page">
      <Header />
      <main style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--color-blue)' }}>Contributors</h1>
        <p>Tech for Us is co-created by a diverse community of thinkers, builders, and users.</p>
      </main>
      <Footer />
    </div>
  );
}