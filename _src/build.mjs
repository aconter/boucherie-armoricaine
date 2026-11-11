// Générateur statique sans dépendance.
// Usage : npm run build  (ou node _src/build.mjs)
// Écrit les pages HTML à la racine du dépôt (publiées telles quelles par GitHub Pages)
// et régénère sitemap.xml.
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { page } from './layout.mjs';

const ici = dirname(fileURLToPath(import.meta.url));
const racine = resolve(ici, '..');
const BASE = 'https://boucheriearmoricaine.com';

const fichiers = (await readdir(join(ici, 'pages'))).filter((f) => f.endsWith('.mjs')).sort();
const pages = [];
for (const f of fichiers) {
  const mod = await import(pathToFileURL(join(ici, 'pages', f)).href);
  pages.push(mod.default);
}

const urls = new Set();
for (const p of pages) {
  const sortie = p.sortie ?? join(p.url.replace(/^\//, ''), 'index.html');
  if (urls.has(sortie)) throw new Error(`Sortie en double : ${sortie}`);
  urls.add(sortie);
  const cible = join(racine, sortie);
  await mkdir(dirname(cible), { recursive: true });
  await writeFile(cible, page(p), 'utf8');
  console.log('écrit', sortie);
}

const aujourdhui = new Date().toISOString().slice(0, 10);
const indexables = pages.filter((p) => p.url && !p.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexables.map((p) => `  <url>\n    <loc>${BASE}${p.url}</loc>\n    <lastmod>${p.lastmod ?? aujourdhui}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
await writeFile(join(racine, 'sitemap.xml'), sitemap, 'utf8');
console.log(`sitemap.xml : ${indexables.length} URL`);
