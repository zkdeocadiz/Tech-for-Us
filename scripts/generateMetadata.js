import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * Recursively scan markdown files in a directory and extract metadata
 */
function scanMarkdownFilesRecursive(dir, items = [], baseDir = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      scanMarkdownFilesRecursive(fullPath, items, path.join(baseDir, entry.name));
    } else if (entry.name.endsWith('.md')) {
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      const { data } = matter(fileContent);
      
      // Create ID from full path (e.g., "20260512-datingprofile/datingprofile")
      const relativePath = path.join(baseDir, path.parse(entry.name).name);
      const id = relativePath.replace(/\\/g, '/');

      items.push({
        id,
        title: data.title || path.parse(entry.name).name,
        description: data.description || '',
        tags: data.tags || [],
        date: data.date || null,
        author: data.author || '',
        ...data,
      });
    }
  });

  return items;
}

/**
 * Scan markdown files in a directory and extract metadata
 * Generates a JS data file with the metadata for use in components
 */
export async function generateMetadataFromMarkdown(sourceDir, outputFile) {
  const items = [];
  const publicDir = path.resolve(process.cwd(), sourceDir);

  if (!fs.existsSync(publicDir)) {
    console.warn(`Directory not found: ${publicDir}`);
    return;
  }

  scanMarkdownFilesRecursive(publicDir, items);

  // Sort by date (newest first)
  items.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date) - new Date(a.date);
  });

  // Generate JS export
  const jsContent = `// Auto-generated from markdown files. Do not edit manually.\nexport const data = ${JSON.stringify(items, null, 2)};`;

  const outputPath = path.resolve(process.cwd(), outputFile);
  fs.writeFileSync(outputPath, jsContent);
  console.log(`Generated ${outputFile} from ${items.length} markdown files`);
}
