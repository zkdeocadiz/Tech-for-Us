import Header from './Header';
import Footer from './Footer';

export default function ActivitySetsPage() {
  return (
    <div className="standard-page">
      <Header />
      <main style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--color-blue)' }}>Activity Sets</h1>
        <p>Curated sets of activities to help you dive deeper into specific themes.</p>
      </main>
      <Footer />
    </div>
  );
}