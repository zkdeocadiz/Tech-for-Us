import Header from './Header';
import Footer from './Footer';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function AlternativeSocialTechPage() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load platform metadata
  useMemo(() => {
    (async () => {
      try {
        const module = await import('../data/alternativeSocialTechData.js');
        setPlatforms(module.data || []);
      } catch (err) {
        console.error('Failed to load alternative social tech data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Get unique tags for filter buttons
  const allTags = useMemo(() => {
    const tags = new Set(['All']);
    platforms.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => tags.add(t));
      }
    });
    return Array.from(tags);
  }, [platforms]);

  // Filter and sort platforms
  const filteredPlatforms = useMemo(() => {
    return platforms
      .filter(p => selectedTag === 'All' || (Array.isArray(p.tags) && p.tags.includes(selectedTag)))
      .sort((a, b) => {
        // Sort by date (newest first), then by title
        if (a.date && b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        return (a.title || '').localeCompare(b.title || '');
      });
  }, [platforms, selectedTag]);

  return (
    <div className="standard-page">
      <Header />
      <main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--color-blue)' }}>Alternative Social Tech Ideas</h1>
        <p style={{ marginBottom: '3rem' }}>
          A searchable collection of social technology alternatives and tools from the community.
        </p>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              style={{
                padding: '0.5rem 1.25rem',
                border: '2px solid var(--color-blue)',
                backgroundColor: selectedTag === tag ? 'var(--color-blue)' : 'transparent',
                color: selectedTag === tag ? 'white' : 'var(--color-blue)',
                cursor: 'pointer',
                fontFamily: 'Inclusive Sans',
                fontWeight: 'bold',
                borderRadius: '4px',
                transition: 'all 120ms ease'
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Platforms Grid */}
        {loading ? (
          <p>Loading platforms...</p>
        ) : filteredPlatforms.length === 0 ? (
          <p>No platforms found for this filter.</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {filteredPlatforms.map(platform => (
              <Link
                key={platform.id}
                to={`/content/alternativesocialtech/${platform.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  border: '2px solid var(--color-light-gray)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-blue)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-light-gray)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <h3 style={{ marginTop: 0, color: 'var(--color-blue)' }}>
                    {platform.title}
                  </h3>
                  <p style={{ flex: 1, color: '#666', lineHeight: '1.6' }}>
                    {platform.description}
                  </p>
                  {Array.isArray(platform.tags) && platform.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      {platform.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.85rem',
                            backgroundColor: 'var(--color-light-gray)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            color: '#666'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {platform.date && (
                    <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '1rem', marginBottom: 0 }}>
                      {new Date(platform.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}