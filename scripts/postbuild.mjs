import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const indexHtml = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtml)) {
  console.error('dist/index.html not found!');
  process.exit(1);
}

const htmlContent = fs.readFileSync(indexHtml, 'utf-8');

// Clean route directories so /studio, /gui-forge, /mcp, /showcase, /docs, /pricing return 200 OK without .html!
const cleanRoutes = [
  'studio',
  'gui-forge',
  'mcp',
  'showcase',
  'docs',
  'pricing',
];

for (const route of cleanRoutes) {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent, 'utf-8');
}

// Fallback 404.html for any nested subpaths
fs.writeFileSync(path.join(distDir, '404.html'), htmlContent, 'utf-8');

// .nojekyll so GitHub Pages serves everything cleanly
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');

console.log('✅ Postbuild complete: Clean routes (/studio, /gui-forge, /mcp, /showcase, /docs, /pricing) + 404.html + .nojekyll created.');
