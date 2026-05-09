import Header from './Header';
import Footer from './Footer';
import { loadResult, STORAGE_KEY as QUIZ_RESULT_STORAGE_KEY } from '../features/quiz/storage';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { localFileStorage } from '../features/content/localFileStorage';
import { annotationStorage, STORAGE_KEY as ANNOTATIONS_STORAGE_KEY } from '../features/content/annotationStorage';

const isQuizStorageKey = (key) =>
  key === QUIZ_RESULT_STORAGE_KEY || key.startsWith('quiz-');

const isDataKey = (key) =>
  key === ANNOTATIONS_STORAGE_KEY ||
  key.startsWith('activity-') ||
  isQuizStorageKey(key);
 
export default function YourContentPage() {
  const [result, setResult] = useState(null);
  const [annotatedPages, setAnnotatedPages] = useState([]);

  useEffect(() => {
    setResult(loadResult());
  }, []);

  useEffect(() => {
    const pages = new Set(annotationStorage.getAnnotatedPages());
    // Iterate through localStorage to find pages with user-generated content
    // Also collect all localStorage keys for debugging purposes
    const allLocalStorageKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allLocalStorageKeys.push(key);
      // Check for activity responses (keyed as activity-{pageId}-{index})
      if (key.startsWith('activity-')) {
        // Extracts pageId from activity-{pageId}-{index}
        // This assumes pageId does not contain hyphens itself, or that the last hyphen is always before the index
        const lastHyphenIndex = key.lastIndexOf('-');
        const pageId = key.substring('activity-'.length, lastHyphenIndex);
        if (pageId) pages.add(pageId);
      }
    }
    // Sort alphabetically for better usability
    setAnnotatedPages(Array.from(pages).sort());
    setAllLocalStorageKeys(allLocalStorageKeys.sort()); // Store all keys for debugging
    // Capture a snapshot of localStorage values on the client to avoid reading during render
    try {
      const map = {};
      allLocalStorageKeys.forEach(k => {
        try { map[k] = localStorage.getItem(k); } catch (e) { map[k] = null; }
      });
      setLocalStorageMap(map);
    } catch (e) {
      setLocalStorageMap({});
    }
  }, []);

  // Helper to turn a pageId into a readable title (e.g. sample-guide -> Sample Guide)
  const formatTitle = (id) => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Comprehensive Data Export (Annotations + Activities + Files + Quiz)
  const handleExportAllData = async () => {
    const backup = {
      localStorage: {},
      indexedDB: {}
    };

    // 1. Pack everything from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (isDataKey(key)) {
        backup.localStorage[key] = localStorage.getItem(key);
      }
    }

    // 2. Pack file contents from IndexedDB
    const activityKeys = Object.keys(backup.localStorage).filter(k => k.startsWith('activity-'));
    for (const key of activityKeys) {
      const content = await localFileStorage.get(key);
      if (content) {
        backup.indexedDB[key] = content;
      }
    }

    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-for-us-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Comprehensive Data Import
  const handleImportAllData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const backup = JSON.parse(event.target.result);
            
            if (backup.localStorage) {
              Object.entries(backup.localStorage).forEach(([k, v]) => localStorage.setItem(k, v));
            }
            
            if (backup.indexedDB) {
              for (const [k, v] of Object.entries(backup.indexedDB)) {
                await localFileStorage.save(k, v);
              }
            }
            
            alert('All data imported successfully! The page will now reload.');
            window.location.reload();
          } catch (err) {
            console.error('Import error:', err);
            alert('Failed to import data. Ensure the file is a valid backup.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Permanently delete all local data
  const handleDeleteAllData = async () => {
    const firstConfirm = window.confirm(
      "Are you sure you want to delete all your data? This includes all annotations, activity responses, and uploaded files. This cannot be undone."
    );
    
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "FINAL WARNING: This will permanently wipe all your progress and content from this browser. Are you absolutely sure?"
    );

    if (!secondConfirm) return;

    try {
      // 1. Clear relevant localStorage keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (isDataKey(key)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // 2. Clear IndexedDB
      await localFileStorage.clearAll();

      alert("All data has been successfully deleted. The page will now reload.");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting data:", err);
      alert("An error occurred while deleting your data. Some data may still remain.");
    }
  };

  const [allLocalStorageKeys, setAllLocalStorageKeys] = useState([]);
  const [localStorageMap, setLocalStorageMap] = useState({});

  return (
    <div className="standard-page">
      <Header />
      <main style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ color: 'var(--color-blue)', marginBottom: '2rem' }}>Your Content</h1>
        <p>This is where you'll find all the pages you've annotated or activity boxes you've filled in.</p>
        
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: 'ApfelGrotezk', fontSize: '2rem', marginBottom: '1.5rem' }}>Your Annotated Works & Activities</h2>
          {annotatedPages.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {annotatedPages.map(pageId => (
                <li key={pageId} style={{ marginBottom: '1.5rem' }}>
                  <Link 
                    to={`/content/${pageId}`} 
                    style={{ 
                      display: 'block',
                      padding: '1.5rem',
                      backgroundColor: 'var(--color-white)',
                      border: '3px solid var(--color-blue)',
                      textDecoration: 'none',
                      color: 'var(--color-blue)',
                      transition: 'transform 120ms ease, background-color 120ms ease',
                      fontFamily: 'ApfelGrotezk',
                      fontSize: '1.5rem',
                      fontWeight: 800
                    }}
                  >
                    {formatTitle(pageId)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: 'italic', color: 'rgba(67, 0, 224, 0.7)' }}>
              You haven't saved any annotations or activity responses yet. 
              Visit any article or activity to start building your collection!
            </p>
          )}
        </section>

        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontFamily: 'ApfelGrotezk', fontSize: '2rem', marginBottom: '1.5rem' }}>Quiz Progress</h2>
          {result ? (
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-pale-pink)', borderRadius: '8px', marginTop: '1rem' }}>
              <p>Your current result: <strong>{result.code}</strong></p>
              <Link to="/technology-types" style={{ color: 'var(--color-blue)', textDecoration: 'underline' }}>View all personalities</Link>
            </div>
          ) : (
            <Link to="/quiz" className="home-button" style={{ display: 'inline-block', marginTop: '1rem' }}>Take the Personality Quiz</Link>
          )}
        </section>

        <section style={{ marginTop: '4rem', padding: '2.5rem', backgroundColor: 'var(--color-blue)', color: 'white' }}>
          <h2 style={{ fontFamily: 'ApfelGrotezk', fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Backup & Sync</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
            Export all your annotations, activity responses, and uploaded files into a single file to move to another device or browser.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={handleExportAllData}
              style={{ 
                padding: '1rem 2rem', 
                backgroundColor: 'var(--color-green)', 
                color: 'white', 
                border: 'none', 
                fontFamily: 'ApfelGrotezk', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Export Full Backup
            </button>
            <button 
              onClick={handleImportAllData}
              style={{ 
                padding: '1rem 2rem', 
                backgroundColor: 'transparent', 
                color: 'white', 
                border: '2px solid white', 
                fontFamily: 'ApfelGrotezk', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Restore From File
            </button>
            <button 
              onClick={handleDeleteAllData}
              style={{ 
                padding: '1rem 2rem', 
                backgroundColor: '#d00', 
                color: 'white', 
                border: 'none', 
                fontFamily: 'ApfelGrotezk', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Delete All Data
            </button>
          </div>
        </section>

        {/* Temporary Debug Section for localStorage */}
        <section style={{ marginTop: '4rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
          <h2 style={{ fontFamily: 'ApfelGrotezk', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-blue)' }}>Debug: All LocalStorage Keys</h2>
          {allLocalStorageKeys.length > 0 ? (
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '0.9rem', color: '#555' }}>
              {allLocalStorageKeys.map(key => (
                <li key={key}><strong>{key}</strong>: {(localStorageMap[key] || '').substring(0, 100)}...</li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#888' }}>No items found in localStorage.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}