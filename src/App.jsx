import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Quiz from './features/quiz/Quiz';
import Results from './features/quiz/Results';
import HomePage from './features/home/HomePage';
import MarkdownPage from './features/content/MarkdownPage';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function MarkdownPageLoader() {
  const { pageId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build paths to try - prioritize results folder
        const paths = [
          `/results/${pageId}.md`,
          `/${pageId}.md`,
        ];

        let success = false;
        let text = '';

        for (const path of paths) {
          try {
            const response = await fetch(path, { headers: { 'Accept': 'text/plain' } });
            if (response.ok) {
              text = await response.text();
              // Verify it's actually markdown and not HTML
              if (text && !text.trim().startsWith('<!DOCTYPE')) {
                success = true;
                break;
              }
            }
          } catch (e) {
            // Continue to next path
            console.error(`Failed to fetch ${path}:`, e);
            continue;
          }
        }

        if (!success) {
          throw new Error(`Could not find markdown file for "${pageId}". Make sure ${pageId}.md exists in /public/results/ or /public/`);
        }

        console.log('Loaded markdown content:', text.substring(0, 100));
        setContent(text);
      } catch (err) {
        console.error('Markdown load error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [pageId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-pale-pink)', color: 'var(--color-blue)', fontFamily: 'Inclusive Sans, sans-serif', fontSize: '20px' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-pale-pink)', color: 'var(--color-blue)', fontFamily: 'Inclusive Sans, sans-serif', fontSize: '20px' }}>
        Error: {error}
      </div>
    );
  }

  return <MarkdownPage content={content} pageId={pageId} />;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/results" element={<Results />} />
        <Route path="/content/:pageId" element={<MarkdownPageLoader />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}