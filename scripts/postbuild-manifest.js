import fs from 'node:fs';
import path from 'node:path';

const clientDir = path.resolve(process.cwd(), 'build/client');
const assetsDir = path.join(clientDir, 'assets');
const publicDir = path.resolve(process.cwd(), 'public');

const manifestFile = fs
  .readdirSync(assetsDir)
  .find((name) => name.startsWith('manifest-') && name.endsWith('.js'));

if (!manifestFile) {
  throw new Error('No manifest-*.js file found in build/client/assets');
}

const manifestPath = path.join(assetsDir, manifestFile);
const manifestSource = fs.readFileSync(manifestPath, 'utf8').trim();

const prefix = 'window.__reactRouterManifest=';
if (!manifestSource.startsWith(prefix) || !manifestSource.endsWith(';')) {
  throw new Error(`Unexpected manifest format in ${manifestPath}`);
}

const manifestJson = manifestSource.slice(prefix.length, -1);

const targets = [
  path.join(clientDir, '__manifest'),
  path.join(publicDir, '__manifest'),
];

for (const target of targets) {
  fs.writeFileSync(target, manifestJson);
}

console.log(`Wrote JSON manifest to: ${targets.join(', ')}`);
