import Header from './Header';
import Footer from './Footer';
import { activities } from './activitiesData';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function ActivitiesPage() {
  const [selectedTag, setSelectedTag] = useState('All');

  // Get unique tags for the filter buttons
  const allTags = useMemo(() => {
    const tags = new Set(['All']);
    activities.forEach(a => a.tags?.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, []);

  // Sort by date (reverse chronological) and filter by tag
  const filteredActivities = useMemo(() => {
    return activities
      .filter(a => selectedTag === 'All' || a.tags?.includes(selectedTag)) // Filter by tag
      .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate)); // Sort by published date
  }, [selectedTag]);

  return (
    <div className="standard-page">
      <Header />
      <main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--color-blue)' }}>Activities</h1>
        <p style={{ marginBottom: '3rem' }}>Explore our collection of workshops, reflections, and practical tools.</p>

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

        {/* Activity Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {filteredActivities.map(activity => (
            <Link 
              key={activity.id} 
              to={`/content/${activity.id}`}
              className="activity-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem',
                backgroundColor: 'var(--color-white)',
                border: '4px solid var(--color-blue)',
                textDecoration: 'none',
                color: 'var(--color-blue)',
                boxShadow: '8px 8px 0px var(--color-blue)',
                transition: 'transform 120ms ease, box-shadow 120ms ease'
              }}
            >
              <span style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>
                Published: {new Date(activity.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                {activity.lastEditedDate && activity.lastEditedDate !== activity.publishedDate && (
                  <span style={{ marginLeft: '10px' }}>Last Edited: {new Date(activity.lastEditedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
              </span>
              <h3 style={{ 
                fontFamily: 'ApfelGrotezk', 
                fontSize: '1.75rem', 
                margin: '0 0 1rem 0',
                lineHeight: 1.1
              }}>
                {activity.title}
              </h3>
              <p style={{ fontSize: '1rem', flex: 1 }}>{activity.description}</p>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                {activity.tags?.map(t => (
                  <span 
                    key={t} 
                    style={{ 
                      fontSize: '0.7rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                      backgroundColor: 'var(--color-pale-pink)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}