import { entreprise as E, navigation } from './data/entreprise.mjs';

// Échappement HTML pour tout texte injecté.
export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const tel = (label = E.telephone, cls = '') =>
  `<a href="tel:${E.telephoneIntl}"${cls ? ` class="${cls}"` : ''}>${esc(label)}</a>`;

export const ENTREPRISE_ID = `${E.url}/#entreprise`;
export const SITE_ID = `${E.url}/#site`;

// ---------- Composants ----------

export function picture({ name, alt, sizes, widths = [640, 1024, 1600, 2000], width, height, eager = false, cls = '' }) {
  const set = (ext) => widths.map((w) => `/assets/img/${name}-${w}.${ext} ${w}w`).join(', ');
  const fallback = `/assets/img/${name}-${widths[1] ?? widths[0]}.webp`;
  return `<picture${cls ? ` class="${cls}"` : ''}>
  <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
  <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
  <img src="${fallback}" alt="${esc(alt)}" width="${width}" height="${height}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>
</picture>`;
}

// Ardoise de prix : rend une grille de tarifs.json.
export function ardoise(grille, { taxe, niveau = 3 } = {}) {
  const h = `h${niveau}`;
  const lignes = grille.lignes
    .map(
      (l) => `<tr>
        <th scope="row">${esc(l.libelle)}${l.detail ? `<span class="ardoise-detail">${esc(l.detail)}</span>` : ''}</th>
        <td>${esc(l.prix).replace(/(\d) €/g, '$1&nbsp;€')}</td>
      </tr>`,
    )
    .join('');
  return `<section class="ardoise" id="grille-${grille.id}" aria-labelledby="t-${grille.id}">
  <${h} id="t-${grille.id}">${esc(grille.titre)}</${h}>
  <p class="ardoise-unite">${esc(grille.unite)}</p>
  <table>
    <thead class="visually-hidden"><tr><th scope="col">Prestation</th><th scope="col">Prix ${esc(taxe)}</th></tr></thead>
    <tbody>${lignes}</tbody>
  </table>
  ${grille.note ? `<p class="ardoise-note">${esc(grille.note)}</p>` : ''}
</section>`;
}

export function grilleTarifs(bloc, { niveau = 3, ids } = {}) {
  const grilles = ids ? bloc.grilles.filter((g) => ids.includes(g.id)) : bloc.grilles;
  return `<div class="ardoises">${grilles.map((g) => ardoise(g, { taxe: bloc.taxe, niveau })).join('')}</div>
<p class="maj">Prix ${esc(bloc.taxe)}. Mise à jour : ${esc(bloc.mise_a_jour)}.</p>`;
}

export function horairesHtml() {
  return `<dl class="horaires">${E.horaires
    .map((h) => `<div><dt>${esc(h.jours)}</dt><dd>${esc(h.texte)}</dd></div>`)
    .join('')}</dl>`;
}

export function adresseHtml() {
  const a = E.adresse;
  return `<address>${esc(E.nom)}<br>${esc(a.rue)}<br>${esc(a.codePostal)} ${esc(a.ville)}<br><span class="discret">${esc(a.complement)}</span></address>`;
}

export function appel({ titre = 'Un animal à faire découper ? Appelez-nous.', texte } = {}) {
  return `<section class="appel" aria-labelledby="appel-titre">
  <div class="conteneur">
    <h2 id="appel-titre">${esc(titre)}</h2>
    <p>${esc(texte ?? `Du lundi au vendredi de 9h à 17h, le samedi de 9h à 12h. ${E.adresse.rue}, ${E.adresse.ville}.`)}</p>
    <div class="boutons">
      ${tel(`Appeler le ${E.telephone}`, 'btn btn-plein')}
      <a class="btn btn-contour-clair" href="/contact/">Envoyer une demande</a>
    </div>
  </div>
</section>`;
}

function filAriane(items) {
  if (!items?.length) return '';
  const all = [{ nom: 'Accueil', url: '/' }, ...items];
  return `<nav class="fil-ariane" aria-label="Fil d'Ariane"><ol>${all
    .map((it, i) =>
      i === all.length - 1
        ? `<li aria-current="page">${esc(it.nom)}</li>`
        : `<li><a href="${it.url}">${esc(it.nom)}</a></li>`,
    )
    .join('')}</ol></nav>`;
}

// ---------- Données structurées ----------

export function schemaEntreprise() {
  const a = E.adresse;
  return {
    '@type': 'ButcherShop',
    '@id': ENTREPRISE_ID,
    name: E.nom,
    legalName: E.raisonSociale,
    description:
      "Abattage, découpe à façon et colis de viande pour particuliers et éleveurs, sur le site de l'abattoir de Lesneven (Finistère). Bœuf, veau, porc, agneau, chevreau.",
    url: `${E.url}/`,
    logo: `${E.url}/assets/img/logo-512.png`,
    image: [`${E.url}/og-boucherie-armoricaine.jpg`, `${E.url}/assets/img/atelier-carcasses-1600.webp`],
    telephone: E.telephoneIntl,
    email: E.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.rue,
      addressLocality: a.ville,
      postalCode: a.codePostal,
      addressRegion: a.region,
      addressCountry: a.pays,
    },
    geo: { '@type': 'GeoCoordinates', latitude: E.geo.lat, longitude: E.geo.lng },
    hasMap: E.googleMaps,
    openingHoursSpecification: E.horaires
      .filter((h) => h.ouvre)
      .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.schemaJours, opens: h.ouvre, closes: h.ferme })),
    paymentAccepted: E.paiement,
    currenciesAccepted: 'EUR',
    areaServed: { '@type': 'AdministrativeArea', name: 'Finistère' },
  };
}

export function schemaService({ nom, type, url, description, zone }) {
  return {
    '@type': 'Service',
    name: nom,
    serviceType: type,
    description,
    url: `${E.url}${url}`,
    provider: { '@id': ENTREPRISE_ID },
    areaServed: (zone ?? ['Finistère']).map((n) => ({ '@type': 'AdministrativeArea', name: n })),
  };
}

function schemaBreadcrumb(items) {
  const all = [{ nom: 'Accueil', url: '/' }, ...items];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: all.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nom,
      item: `${E.url}${it.url}`,
    })),
  };
}

// ---------- Gabarit de page ----------

export function page({ url, title, description, h1, chapo, ariane, schema = [], noindex = false, body, accueil = false, hero, ogImage }) {
  const canonical = `${E.url}${url}`;
  const graph = [...schema];
  if (ariane?.length) graph.push(schemaBreadcrumb(ariane));
  const jsonLd = graph.length
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 1)}</script>`
    : '';
  const og = ogImage ?? `${E.url}/og-boucherie-armoricaine.jpg`;
  const navHtml = navigation
    .map((n) => `<li><a href="${n.href}"${url === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`)
    .join('');

  const entete = hero
    ? hero
    : `<div class="entete-page">
    <div class="conteneur">
      ${filAriane(ariane)}
      <h1>${esc(h1)}</h1>
      ${chapo ? `<p class="chapo">${esc(chapo)}</p>` : ''}
    </div>
  </div>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}${url ? `<link rel="canonical" href="${canonical}">\n` : ''}<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#2B2D31">
<link rel="preload" href="/assets/fonts/source-sans-3-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/playfair-display-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="${esc(E.nom)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
${url ? `<meta property="og:url" content="${canonical}">\n` : ''}<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
${jsonLd}
</head>
<body${accueil ? ' class="accueil"' : ''}>
<a class="evitement" href="#contenu">Aller au contenu</a>
<header class="site-entete">
  <div class="conteneur entete-barre">
    <a class="marque" href="/">
      <picture>
        <source type="image/avif" srcset="/assets/img/logo-160.avif 1x, /assets/img/logo-320.avif 2x">
        <img src="/assets/img/logo-160.webp" srcset="/assets/img/logo-160.webp 1x, /assets/img/logo-320.webp 2x" alt="" width="64" height="60">
      </picture>
      <span class="marque-texte"><span class="marque-nom">Boucherie Armoricaine</span><span class="marque-lieu">Abattage et découpe, Lesneven</span></span>
    </a>
    ${tel(E.telephone, 'btn-appel-entete')}
    <button class="menu-bouton" type="button" aria-expanded="false" aria-controls="menu-principal">
      <span class="menu-icone" aria-hidden="true"></span><span class="menu-libelle">Menu</span>
    </button>
    <nav class="nav-principale" id="menu-principal" aria-label="Navigation principale">
      <ul>${navHtml}</ul>
    </nav>
  </div>
</header>
<main id="contenu">
${entete}
${body}
</main>
<footer class="site-pied">
  <div class="conteneur pied-grille">
    <div>
      <p class="pied-nom">${esc(E.nom)}</p>
      ${adresseHtml()}
      <p>${tel(E.telephone)}<br><a href="mailto:${E.email}">${E.email}</a></p>
    </div>
    <div>
      <p class="pied-titre">Horaires</p>
      ${horairesHtml()}
    </div>
    <nav aria-label="Liens du pied de page">
      <p class="pied-titre">Le site</p>
      <ul>
        <li><a href="/decoupe-viande-particuliers/">Découpe pour particuliers</a></li>
        <li><a href="/decoupe-cochon/">Découpe de porc et porcelet</a></li>
        <li><a href="/abattage-decoupe-eleveurs/">Découpe à façon pour éleveurs</a></li>
        <li><a href="/colis-de-viande/">Colis de viande</a></li>
        <li><a href="/tarifs/">Tarifs</a></li>
        <li><a href="/zone-intervention/">Zone d'intervention</a></li>
        <li><a href="/faq/">Questions fréquentes</a></li>
        <li><a href="/contact/">Contact et accès</a></li>
      </ul>
    </nav>
  </div>
  <div class="conteneur pied-bas">
    <p>© ${new Date().getFullYear()} ${esc(E.nom)}, ${esc(E.raisonSociale)}. <a href="/mentions-legales/">Mentions légales</a></p>
    <p class="credit">Site réalisé par <a href="https://informatique-plouguerneau-antoine-conter.fr/" rel="noopener"><img src="/Antoine-CONTER-informatique-Logo.avif" alt="Antoine CONTER Informatique" width="40" height="40" loading="lazy"></a></p>
  </div>
</footer>
<div class="barre-mobile" aria-label="Contact rapide">
  ${tel('Appeler', 'btn btn-plein')}
  <a class="btn btn-contour" href="/contact/">Écrire</a>
</div>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}
