import ContentPage from "../App.jsx";

export const meta = ({ data, params }) => {
  // Get OG data from the app data if available
  const appData = data?.appData || {};
  
  const title = appData['og-title'] || appData.title || 'Tech for Us';
  const description = appData['og-description'] || appData.description || '';
  const image = appData['og-image'] || appData.image || '';

  const tags = [
    { title },
    { name: 'description', content: description },
  ];

  if (description) {
    tags.push(
      { property: 'og:title', content: title },
      { property: 'og:description', content: description }
    );
  }

  if (image) {
    tags.push({ property: 'og:image', content: image });
  }

  return tags;
};

export default function ContentPageRoute() {
	return <ContentPage />;
}