import { Link, useParams } from 'react-router';
import Quiz from './features/quiz/Quiz';
import Results from './features/quiz/Results';
import TechnologyTypesPage from './features/quiz/TechnologyTypesPage';
import HomePage from './features/home/HomePage';
import MarkdownPage from './features/content/MarkdownPage';
import ScoreVisualization from './features/quiz/ScoreVisualization';
import { loadResult } from './features/quiz/storage';
import Header from './components/Header';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import matter from 'gray-matter';
import YourContentPage from './components/YourContentPage';
import ActivitiesPage from './components/ActivitiesPage';
import { activities } from './components/activitiesData';
import ActivitySetsPage from './components/ActivitySetsPage';
import AlternativeSocialTechPage from './components/AlternativeSocialTechPage';
import ContributorsPage from './components/ContributorsPage';
import { isValidElement } from 'react';

export function NotFoundPage() {
  return (
    <div className="standard-page">
      <Header />
      <main style={{ 
        padding: '8rem 2rem', 
        textAlign: 'center', 
        maxWidth: '800px', 
        margin: '0 auto', 
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ color: 'var(--color-blue)', fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontFamily: 'ApfelGrotezk', marginBottom: '2rem' }}>This page doesn't exist yet.</h2>
        <p style={{ marginBottom: '3rem' }}>Maybe it's still being built, or the link has changed.</p>
        <Link to="/" className="home-button">Back to Safety</Link>
      </main>
      <Footer />
    </div>
  );
}

export default function MarkdownPageLoader() {
  const { pageId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [fileMetadata, setFileMetadata] = useState({});
  const [error, setError] = useState(null);
  const storedResult = loadResult();
  const resultPageId = storedResult
    ? (storedResult.fSubtype
      ? storedResult.code.replace('F', storedResult.fSubtype)
      : storedResult.code)
    : null;

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build paths to try - prioritize results folder
        const paths = [
          `/results/${pageId}.md`,
          `/activities/${pageId}.md`,
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
        
        // Parse YAML frontmatter with gray-matter
        const { data, content } = matter(text);
        let extractedMetadata = {
          title: data['og-title'] || data.title || '',
          description: data['og-description'] || data.description || '',
          ogImage: data['og-image'] || data.image || '',
          tags: data.tags || [],
          date: data.date || null,
          ...data, // Include all frontmatter fields
        };

        setFileMetadata(extractedMetadata);
        setContent(content);
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

  const isTechnologyTypePage = /^[EW][DM](G|FT|FP)[CL]$/i.test(pageId);
  const hasMoreSection = /\[\[\s*MORE_TECH_TYPES_BUTTONS\s*\]\]/i.test(content);
  const moreSection = `\n\n## More about technology types\n\n[[MORE_TECH_TYPES_BUTTONS]]\n`;
  const contentWithMore = isTechnologyTypePage && !hasMoreSection ? `${content}${moreSection}` : content;

  const markdownComponents = {
    p: ({ children, renderHighlightedNode }) => {
      const childrenToText = (node) => {
        const arr = Array.isArray(node) ? node : [node];
        return arr
          .map((child) => {
            if (typeof child === 'string') return child;
            if (isValidElement(child)) return childrenToText(child.props.children);
            return '';
          })
          .join('');
      };

      const text = childrenToText(children).trim();
      const hasResultBarsToken = /\[\[\s*RESULT_BARS\s*\]\]/i.test(text);
      const hasMoreButtonsToken = /\[\[\s*MORE_TECH_TYPES_BUTTONS\s*\]\]/i.test(text);

      if (hasResultBarsToken) {
        const isMatchingResultPage =
          !!storedResult && !!resultPageId && pageId.toUpperCase() === resultPageId.toUpperCase();

        if (isMatchingResultPage) {
          return <ScoreVisualization scores={storedResult.scores} fSubtype={storedResult.fSubtype} showTitle={false} />;
        }

        // Suppress raw token text on non-matching type pages.
        return null;
      }

      if (hasMoreButtonsToken) {
        return (
          <div className="markdown-page__resource-actions">
            <Link
              to="/technology-types"
              className="markdown-page__resource-button"
            >
              View all technology types
            </Link>
            <Link
              to="/content/Categories"
              className="markdown-page__resource-button"
            >
              Read what the categories mean
            </Link>
            <Link
              to={storedResult ? '/quiz/results' : '/quiz'}
              className="markdown-page__resource-button"
            >
              View your result
            </Link>
          </div>
        );
      }

      return <p>{renderHighlightedNode ? renderHighlightedNode(children, 'p-content') : children}</p>;
    }
  };

  const metadata = (() => {
    const registryMatch = activities.find(a => a.id === pageId);

    const readableTitle = pageId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const fallback = {
      id: pageId,
      title: isTechnologyTypePage ? `Technology Type: ${pageId.toUpperCase()}` : readableTitle,
      description: isTechnologyTypePage 
        ? `Discover the characteristics and traits of the ${pageId.toUpperCase()} technology personality.`
        : "Explore interactive content and reflections on our relationship with technology.",
      ogImage: "/og-image-default.jpg", // Ensure this file exists in /public/
      // We omit publishedDate/lastEditedDate so they don't show up on standard pages
      isFallback: true 
    };

    // Merge hierarchy: 
    // 1. Metadata defined in the .md file itself (Highest priority via fileMetadata)
    // 2. Data from activitiesData.js
    // 3. Synthetic fallback logic
    return { ...fallback, ...registryMatch, ...fileMetadata };
  })();

  return <MarkdownPage content={contentWithMore} pageId={pageId} markdownComponents={markdownComponents} metadata={metadata} />;
}