#!/usr/bin/env node
/**
 * Prebuild script: Generate metadata from markdown files
 * Runs before React Router build to create JS data files
 */
import { generateMetadataFromMarkdown } from './generateMetadata.js';

async function prebuild() {
  console.log('🔨 Generating metadata from markdown files...\n');

  await generateMetadataFromMarkdown(
    'public/alternativesocialtech',
    'app/data/alternativeSocialTechData.js'
  );

  await generateMetadataFromMarkdown(
    'public/activities',
    'app/data/activitiesMetadataData.js'
  );

  console.log('\n✓ Metadata generation complete');
}

prebuild().catch(err => {
  console.error('Error during prebuild:', err);
  process.exit(1);
});
