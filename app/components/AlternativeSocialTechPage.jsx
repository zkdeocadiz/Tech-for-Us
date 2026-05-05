import Header from './Header';
import Footer from './Footer';

export default function AlternativeSocialTechPage() {
  return (
    <div className="standard-page">
      <Header />
      <main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--color-blue)' }}>Alternative Social Tech Ideas</h1>
        <p>A searchable grid of social technology alternatives from the community.</p>
        {/* TODO: Implement filtering grid using content from public/alternativesocialtech */}
      </main>
      <Footer />
    </div>
  );
}