// Vérification statique du site généré (aucune requête réseau).
// Usage : node tests/verifier.mjs
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ignores = new Set(['.git', '.claude', '_src', 'node_modules', 'tests']);
const erreurs = [];
const avert = [];
const ok = (cond, msg) => { if (!cond) erreurs.push(msg); };

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (ignores.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name.endsWith('.html') && !e.name.startsWith('google')) out.push(p);
  }
  return out;
}
const existe = async (p) => { try { await stat(p); return true; } catch { return false; } };

function cible(href) {
  const chemin = href.split('#')[0].split('?')[0];
  if (chemin.endsWith('/')) return join(racine, chemin, 'index.html');
  return join(racine, chemin);
}

const fichiers = await htmlFiles(racine);
const titres = new Map();
let nbLiens = 0;
const ancres = new Map();

for (const f of fichiers) {
  const rel = f.slice(racine.length).replace(/\\/g, '/');
  const html = await readFile(f, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  ancres.set(rel, ids);

  const h1 = [...html.matchAll(/<h1[\s>]/g)].length;
  ok(h1 === 1, `${rel} : ${h1} balise(s) h1`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  ok(title.length >= 20 && title.length <= 80, `${rel} : title de ${title.length} caractères`);
  if (titres.has(title)) erreurs.push(`${rel} : title identique à ${titres.get(title)}`);
  titres.set(title, rel);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const descLen = desc.replace(/&[a-z#0-9]+;/g, 'x').length;
  ok(descLen >= 70 && descLen <= 160, `${rel} : meta description de ${descLen} caractères`);
  const noindex = /name="robots" content="noindex/.test(html);
  if (!rel.endsWith('404.html')) ok(/<link rel="canonical" href="https:\/\/boucheriearmoricaine\.com\//.test(html), `${rel} : canonical absente`);
  ok(/<html lang="fr">/.test(html), `${rel} : lang fr absent`);
  ok(/<main id="contenu">/.test(html), `${rel} : main absent`);
  ok(!/onclick=/.test(html), `${rel} : gestionnaire onclick en ligne`);
  if (!rel.includes('mentions-legales')) ok(!/À COMPLÉTER/.test(html), `${rel} : texte à compléter`);
  else if (/À COMPLÉTER/.test(html)) avert.push(`${rel} : champs [À COMPLÉTER] à renseigner avant mise en ligne`);

  // Ordre des titres : pas de saut de niveau descendant.
  let prec = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const n = Number(m[1]);
    if (prec && n > prec + 1) erreurs.push(`${rel} : saut de titre h${prec} vers h${n}`);
    prec = n;
  }

  // JSON-LD valide
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { erreurs.push(`${rel} : JSON-LD invalide (${e.message})`); }
  }
  // Images : alt présent, dimensions présentes, fichier existant
  for (const m of html.matchAll(/<img\s[^>]*>/g)) {
    const tag = m[0];
    ok(/\salt="/.test(tag), `${rel} : img sans alt ${tag.slice(0, 80)}`);
    ok(/\swidth="\d+"/.test(tag) && /\sheight="\d+"/.test(tag), `${rel} : img sans dimensions ${tag.slice(0, 80)}`);
  }
  for (const m of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith('/')) ok(await existe(join(racine, u)), `${rel} : ressource manquante ${u}`);
    }
  }
  for (const m of html.matchAll(/<link [^>]*href="(\/[^"]+)"/g)) ok(await existe(join(racine, m[1])), `${rel} : ressource manquante ${m[1]}`);
  // Liens téléphone
  for (const m of html.matchAll(/href="tel:([^"]+)"/g)) ok(m[1] === '+33298210899', `${rel} : lien tel inattendu ${m[1]}`);
  // Liens internes
  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    nbLiens++;
    const href = m[1];
    if (/\.(png|avif|webp|css|js|woff2|jpg)$/.test(href)) continue;
    ok(await existe(cible(href)), `${rel} : lien cassé ${href}`);
  }
  // Liens externes ouverts sans noopener
  for (const m of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) ok(/noopener/.test(m[0]), `${rel} : target _blank sans noopener`);
  if (noindex) avert.push(`${rel} : noindex (volontaire)`);
}

// Ancres internes
for (const f of fichiers) {
  const rel = f.slice(racine.length).replace(/\\/g, '/');
  const html = await readFile(f, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"#]*)#([^"]+)"/g)) {
    const page = (m[1].endsWith('/') ? m[1] + 'index.html' : m[1]);
    const ids = ancres.get(page);
    if (ids) ok(ids.has(m[2]), `${rel} : ancre introuvable ${m[1]}#${m[2]}`);
  }
}

// Sitemap
const sitemap = await readFile(join(racine, 'sitemap.xml'), 'utf8');
for (const m of sitemap.matchAll(/<loc>https:\/\/boucheriearmoricaine\.com(\/[^<]*)<\/loc>/g)) {
  ok(await existe(cible(m[1])), `sitemap : URL sans fichier ${m[1]}`);
}
const nbSitemap = [...sitemap.matchAll(/<loc>/g)].length;

// Pages orphelines : chaque page indexable doit être liée depuis au moins une autre page.
const toutHtml = (await Promise.all(fichiers.map((f) => readFile(f, 'utf8')))).join('\n');
for (const m of sitemap.matchAll(/<loc>https:\/\/boucheriearmoricaine\.com(\/[^<]*)<\/loc>/g)) {
  if (m[1] === '/') continue;
  ok(toutHtml.includes(`href="${m[1]}"`), `page orpheline : ${m[1]}`);
}

console.log(`Pages HTML : ${fichiers.length} | liens internes vérifiés : ${nbLiens} | URL sitemap : ${nbSitemap}`);
for (const a of avert) console.log('AVERTISSEMENT', a);
if (erreurs.length) {
  for (const e of erreurs) console.log('ERREUR', e);
  process.exitCode = 1;
} else console.log('Aucune erreur.');
