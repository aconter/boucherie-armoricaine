// Pages de zones : un hub et une page par bassin de vie.
// Données factuelles (communes officielles, distances routières) : _src/data/zones.json,
// produit par _src/outils/calcul-distances.py.
// Règles : un seul établissement (Lesneven), aucune promesse de livraison ni de déplacement,
// « nos clients viennent de... » uniquement là où l'entreprise l'a confirmé.
import zones from '../data/zones.json' with { type: 'json' };
import { entreprise as E } from '../data/entreprise.mjs';
import { tel, esc, appel, ENTREPRISE_ID } from '../layout.mjs';

const HUB = '/zone-intervention/';
const BASE = 'https://boucheriearmoricaine.com';
// Îles : accès par bateau, temps de route sans objet.
const ILES = new Set(['Île-Molène', 'Ouessant', 'Île-de-Batz', 'Île-de-Sein']);

const fmtMin = (m) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}`);
const listeFr = (arr) => (arr.length <= 1 ? arr.join('') : `${arr.slice(0, -1).join(', ')} et ${arr.at(-1)}`);
const routesTxt = (routes) => {
  const r = routes.filter((x) => /^[ND]\d/.test(x)).map((x) => `la ${x}`);
  return r.length ? `par ${listeFr(r)}` : '';
};

// Textes propres à chaque bassin. `clients` : provenance confirmée par l'entreprise.
// `eleveurs` : éleveurs du secteur confirmés.
const BASSINS = {
  'pays-de-lesneven-cote-des-legendes': {
    nom: 'Pays de Lesneven et Côte des Légendes',
    court: 'Lesneven et Côte des Légendes',
    title: 'Découpe de viande Lesneven et Côte des Légendes | Boucherie Armoricaine',
    h1: 'Découpe de viande à Lesneven et sur la Côte des Légendes',
    intro: "L'atelier est à Lesneven même, au 23 rue d'Arvor, sur le site de l'abattoir. C'est la commune d'implantation de la Boucherie Armoricaine : pour les habitants du Folgoët, de Ploudaniel, de Kerlouan ou de Guissény, l'atelier est à quelques minutes.",
    clients: true,
    eleveurs: true,
  },
  'pays-des-abers': {
    nom: 'Pays des Abers',
    court: 'Pays des Abers',
    title: 'Découpe de viande Pays des Abers, Lannilis, Plouguerneau | Boucherie Armoricaine',
    h1: 'Faire découper son animal depuis le Pays des Abers',
    intro: "Plabennec, Lannilis, Plouguerneau, Landéda : les particuliers et les éleveurs des Abers viennent à Lesneven pour faire abattre et découper leurs animaux.",
    clients: true,
    eleveurs: true,
  },
  'brest-iroise': {
    nom: "Brest métropole et pays d'Iroise",
    court: "Brest et pays d'Iroise",
    title: "Découpe de viande pour Brest et le pays d'Iroise | Boucherie Armoricaine",
    h1: "Découpe de viande pour Brest et le pays d'Iroise",
    intro: "Depuis Brest, Guipavas, Saint-Renan ou Ploudalmézeau, l'atelier de Lesneven est accessible par la N12 puis la D770. Des particuliers de la métropole brestoise et du pays d'Iroise nous confient leur cochon, leur agneau ou leur bœuf.",
    clients: true,
    eleveurs: false,
  },
  'landerneau-daoulas': {
    nom: 'Pays de Landerneau-Daoulas',
    court: 'Landerneau-Daoulas',
    title: 'Découpe de viande Landerneau et Daoulas | Boucherie Armoricaine Lesneven',
    h1: 'Découpe de viande pour le pays de Landerneau-Daoulas',
    intro: "Particuliers et éleveurs du pays de Landerneau-Daoulas font partie de nos clients. Depuis Landerneau, Daoulas, Plouédern ou La Roche-Maurice, l'atelier de Lesneven est accessible par la D770.",
    clients: true,
    eleveurs: true,
  },
  'landivisiau-haut-leon': {
    nom: 'Pays de Landivisiau et Haut-Léon',
    court: 'Landivisiau et Haut-Léon',
    title: 'Découpe de viande Landivisiau, Haut-Léon, Plouescat | Boucherie Armoricaine',
    h1: 'Découpe de viande pour le pays de Landivisiau et le Haut-Léon',
    intro: "Lesneven est au cœur du Léon : nous travaillons avec des éleveurs du secteur et accueillons des particuliers de Landivisiau, Plouescat ou Plounévez-Lochrist.",
    clients: true,
    eleveurs: true,
  },
  'pays-de-morlaix': {
    nom: 'Pays de Morlaix',
    court: 'Pays de Morlaix',
    title: 'Découpe de viande pour le pays de Morlaix | Boucherie Armoricaine Lesneven',
    h1: 'Faire découper son animal depuis le pays de Morlaix',
    intro: "Vous habitez Morlaix, Saint-Martin-des-Champs, Plougonven ou le Trégor finistérien ? L'atelier de découpe de Lesneven est accessible par la N12. Appelez-nous avant de vous déplacer pour convenir d'une date.",
    clients: false,
    eleveurs: false,
  },
  'centre-et-sud-finistere': {
    nom: 'Centre et Sud Finistère',
    court: 'Centre et Sud Finistère',
    title: 'Découpe de viande Sud Finistère, Quimper, Châteaulin | Boucherie Armoricaine',
    h1: 'Centre et Sud Finistère : venir à notre atelier de Lesneven',
    intro: "Depuis la Cornouaille, la presqu'île de Crozon, les monts d'Arrée ou le Poher, l'atelier de Lesneven est à une ou deux heures de route, principalement par la N165 puis la D770. Pour un animal entier ou un demi, appelez-nous avant de vous déplacer : nous convenons ensemble d'une date.",
    clients: false,
    eleveurs: false,
  },
};

function bornes(communes) {
  const m = communes.map((c) => c.min);
  return [Math.min(...m), Math.max(...m)];
}

function tableCommunes(communes, legende) {
  return `<div class="table-defilante">
  <table class="table-communes">
    <caption>${esc(legende)}</caption>
    <thead><tr><th scope="col">Commune</th><th scope="col">Distance</th><th scope="col">Temps de route</th></tr></thead>
    <tbody>${communes
      .map((c) => `<tr><th scope="row">${esc(c.nom)}</th><td>${c.km} km</td><td>${fmtMin(c.min)}</td></tr>`)
      .join('')}</tbody>
  </table>
</div>`;
}

const noteSource = `<p class="note-source">Distances et temps de route indicatifs, calculés depuis le centre de chaque commune jusqu'à l'atelier (itinéraires OpenStreetMap, ${zones.calcule_le.split('-').reverse().join('/')}). Les îles, accessibles par bateau, ne sont pas listées.</p>`;

const liensPrestations = (eleveurs) => `<ul class="liens-liste">
  <li><a href="/decoupe-viande-particuliers/">Faire découper votre animal (particuliers)</a></li>
  <li><a href="/decoupe-cochon/">Cochon, demi-porc et porcelet</a></li>
  <li><a href="/colis-de-viande/">Colis de viande au détail</a></li>
  <li><a href="/abattage-decoupe-eleveurs/">Découpe à façon pour éleveurs${eleveurs ? '' : ' (tarifs HT)'}</a></li>
</ul>`;

// ---------- Pages de bassin ----------
const pagesBassins = zones.bassins.map((b) => {
  const cfg = BASSINS[b.id];
  const url = `${HUB}${b.id}/`;
  const groupes = b.groupes.map((g) => ({ ...g, communes: g.communes.filter((c) => !ILES.has(c.nom)) }));
  const toutes = groupes.flatMap((g) => g.communes);
  const [mini, maxi] = bornes(toutes);
  const multi = groupes.length > 2;

  const itineraires = groupes
    .filter((g) => g.ville_principale !== 'Lesneven')
    .map((g) => {
      const v = g.communes.find((c) => c.nom === g.ville_principale);
      const r = routesTxt(g.routes);
      return v ? `<li>Depuis <strong>${esc(v.nom)}</strong> : ${v.km} km, environ ${fmtMin(v.min)}${r ? `, ${r}` : ''}.</li>` : '';
    })
    .join('');

  const tables = multi
    ? groupes
        .map((g) => {
          const [a, z] = bornes(g.communes);
          return `<details class="groupe-communes"><summary>${esc(g.epci)} : ${g.communes.length} communes, ${fmtMin(a)} à ${fmtMin(z)}</summary>${tableCommunes(g.communes, `Communes : ${g.epci}`)}</details>`;
        })
        .join('')
    : groupes.map((g) => tableCommunes(g.communes, `${g.epci} : communes de la plus proche à la plus éloignée`)).join('');

  const voisins = zones.bassins
    .filter((x) => x.id !== b.id)
    .map((x) => `<li><a href="${HUB}${x.id}/">${esc(BASSINS[x.id].nom)}</a></li>`)
    .join('');

  const schema = cfg.clients
    ? [
        {
          '@type': 'Service',
          name: `Abattage et découpe de viande : ${cfg.nom}`,
          serviceType: 'Abattage et découpe à façon',
          url: `${BASE}${url}`,
          provider: { '@id': ENTREPRISE_ID },
          areaServed: toutes.map((c) => ({ '@type': 'City', name: c.nom })),
        },
      ]
    : [];

  const description = `${cfg.court} : ${toutes.length} communes à ${fmtMin(mini)} à ${fmtMin(maxi)} de notre atelier de découpe de Lesneven. Abattage, découpe, colis. Temps de route par commune.`;

  return {
    url,
    title: cfg.title,
    description: description.length > 160 ? `${cfg.court} : temps de route par commune jusqu'à notre atelier de découpe de Lesneven. Abattage, découpe, colis de viande.` : description,
    h1: cfg.h1,
    chapo: `${toutes.length} communes, de ${fmtMin(mini)} à ${fmtMin(maxi)} de route de l'atelier de Lesneven.`,
    ariane: [
      { nom: "Zone d'intervention", url: HUB },
      { nom: cfg.nom, url },
    ],
    schema,
    body: `
<div class="bloc">
  <div class="conteneur deux-colonnes">
    <div class="prose">
      <h2>Un seul atelier, à Lesneven</h2>
      <p>${esc(cfg.intro)}</p>
      <p>Toutes les prestations ont lieu à notre atelier du ${esc(E.adresse.rue)}, à Lesneven : vous y amenez votre animal, il y est abattu et découpé selon vos consignes, et vous y récupérez vos colis.${cfg.clients ? '' : ' Nous n\'avons pas d\'autre établissement.'}</p>
      ${itineraires ? `<h3>Itinéraire</h3><ul class="liste-coches">${itineraires}</ul>` : ''}
      ${cfg.eleveurs ? '<p>Nous travaillons aussi avec des <strong>éleveurs du secteur</strong> pour la découpe à façon destinée à la vente directe. <a href="/abattage-decoupe-eleveurs/">Voir la prestation et les tarifs HT</a>.</p>' : ''}
    </div>
    <div class="prestations">
      <h2>Ce que nous faisons</h2>
      ${liensPrestations(cfg.eleveurs)}
      <p>Avant de venir, appelez le ${tel(E.telephone)} pour convenir d'une date.</p>
    </div>
  </div>
</div>

<div class="bloc bloc-creme">
  <div class="conteneur">
    <h2>Temps de route par commune</h2>
    <p class="intro">Toutes les communes du secteur, avec la distance et le temps de route jusqu'à l'atelier de Lesneven.</p>
    ${tables}
    ${noteSource}
  </div>
</div>

<div class="bloc">
  <div class="conteneur">
    <h2>Autres secteurs</h2>
    <ul class="liens-colonnes">${voisins}<li><a href="${HUB}bretagne-eleveurs/">Éleveurs des Côtes-d'Armor et du Morbihan</a></li></ul>
  </div>
</div>
${appel({ titre: `Vous êtes ${cfg.clients ? 'dans le secteur' : 'de ce secteur'} ? Appelez-nous.` })}
`,
  };
});

// ---------- Page éleveurs de Bretagne ----------
const urlBretagne = `${HUB}bretagne-eleveurs/`;
const parDep = (d) => zones.bretagne.filter((v) => v.departement === d);
const tableVilles = (villes, legende) => `<div class="table-defilante">
  <table class="table-communes">
    <caption>${esc(legende)}</caption>
    <thead><tr><th scope="col">Depuis</th><th scope="col">Distance</th><th scope="col">Temps de route</th><th scope="col">Itinéraire principal</th></tr></thead>
    <tbody>${villes
      .sort((a, b) => a.min - b.min)
      .map((v) => `<tr><th scope="row">${esc(v.nom)}</th><td>${v.km} km</td><td>${fmtMin(v.min)}</td><td>${esc(v.routes.filter((x) => /^[ND]\d/.test(x)).join(', '))}</td></tr>`)
      .join('')}</tbody>
  </table>
</div>`;

const pageBretagne = {
  url: urlBretagne,
  title: 'Découpe à façon pour éleveurs en Bretagne (29, 22, 56) | Boucherie Armoricaine',
  description:
    "Éleveurs du Finistère, des Côtes-d'Armor et du Morbihan : abattage et découpe à façon pour la vente directe, à notre atelier de Lesneven. Temps de route.",
  h1: 'Éleveurs de Bretagne : découpe à façon à Lesneven',
  chapo: "Finistère, Côtes-d'Armor, Morbihan : notre atelier de découpe est à Lesneven, dans le Nord Finistère.",
  ariane: [
    { nom: "Zone d'intervention", url: HUB },
    { nom: 'Éleveurs de Bretagne', url: urlBretagne },
  ],
  body: `
<div class="bloc">
  <div class="conteneur deux-colonnes">
    <div class="prose">
      <h2>Une prestation pour la vente directe</h2>
      <p>La Boucherie Armoricaine abat et découpe les animaux des éleveurs sur le site de l'abattoir de Lesneven, puis rend une viande prête à vendre : découpée selon vos fiches, mise sous vide et en cartons. Bovins, veaux, porcs, porcelets, ovins et caprins. Formules PAD et semi-paré pour la bête entière ou la demi-bête.</p>
      <p>Nous travaillons aujourd'hui avec des éleveurs du Léon, du Pays des Abers, de la Côte des Légendes et du pays de Landerneau-Daoulas.</p>
      <h2>Vous élevez dans les Côtes-d'Armor ou le Morbihan ?</h2>
      <p>L'atelier n'a qu'un site, à Lesneven. Appelez-nous au ${tel(E.telephone)} pour vérifier ensemble si nous pouvons accueillir vos animaux, et à quelles conditions : dates d'abattage, acheminement des animaux, volumes, consignes de découpe.</p>
      <p><a class="btn btn-plein" href="/contact/#professionnel">Demander un devis professionnel</a></p>
    </div>
    <div class="prestations">
      <h2>À voir aussi</h2>
      <ul class="liens-liste">
        <li><a href="/abattage-decoupe-eleveurs/">Déroulement de la prestation</a></li>
        <li><a href="/tarifs/#professionnels">Tarifs professionnels HT</a></li>
        <li><a href="/faq/">Questions fréquentes</a></li>
      </ul>
    </div>
  </div>
</div>
<div class="bloc bloc-creme">
  <div class="conteneur">
    <h2>Temps de route jusqu'à l'atelier</h2>
    ${tableVilles(parDep('22'), "Côtes-d'Armor (22)")}
    ${tableVilles(parDep('56'), 'Morbihan (56)')}
    <p class="intro">Finistère : voir le détail <a href="${HUB}">commune par commune</a>.</p>
    <p class="note-source">Distances et temps de route indicatifs depuis le centre de chaque ville (itinéraires OpenStreetMap, ${zones.calcule_le.split('-').reverse().join('/')}).</p>
  </div>
</div>
${appel({ titre: 'Organiser vos dates d’abattage' })}
`,
};

// ---------- Hub ----------
const cartesBassins = (ids) =>
  zones.bassins
    .filter((b) => ids.includes(b.id))
    .map((b) => {
      const cfg = BASSINS[b.id];
      const toutes = b.groupes.flatMap((g) => g.communes).filter((c) => !ILES.has(c.nom));
      const [a, z] = bornes(toutes);
      const exemples = [...toutes].sort((x, y) => y.population - x.population).slice(0, 5).map((c) => c.nom);
      return `<section class="bassin">
        <h3><a href="${HUB}${b.id}/">${esc(cfg.nom)}</a></h3>
        <p>${toutes.length} communes, de ${fmtMin(a)} à ${fmtMin(z)} de route.</p>
        <p class="communes">${esc(exemples.join(', '))}…</p>
      </section>`;
    })
    .join('');

const nord = ['pays-de-lesneven-cote-des-legendes', 'pays-des-abers', 'brest-iroise', 'landerneau-daoulas', 'landivisiau-haut-leon', 'pays-de-morlaix'];

const hub = {
  url: HUB,
  title: "Zone d'intervention : Finistère et Bretagne | Boucherie Armoricaine",
  description:
    "Particuliers et éleveurs du Finistère Nord, du Finistère Sud et de Bretagne : temps de route commune par commune jusqu'à notre atelier de découpe de Lesneven.",
  h1: "D'où venir : Finistère et Bretagne",
  chapo: "Une seule adresse, l'atelier du 23 rue d'Arvor à Lesneven, sur le site de l'abattoir. Retrouvez le temps de route depuis votre commune.",
  ariane: [{ nom: "Zone d'intervention", url: HUB }],
  body: `
<div class="bloc">
  <div class="conteneur prose-page">
    <div class="prose">
      <h2>Tout se passe à Lesneven</h2>
      <p>Nous n'avons qu'un seul site : l'atelier de découpe installé sur le site de l'abattoir de Lesneven. Vous y amenez votre animal, il y est abattu et découpé, et vous y récupérez vos colis. Avant de venir, appelez-nous au ${tel(E.telephone)} pour convenir d'une date.</p>
      <p>Nos clients viennent surtout du Nord Finistère : Côte des Légendes, Pays des Abers, Léon, pays de Landerneau-Daoulas et région de Brest.</p>
    </div>
  </div>
</div>

<div class="bloc bloc-creme" id="finistere-nord">
  <div class="conteneur">
    <h2>Finistère Nord</h2>
    <div class="bassins">${cartesBassins(nord)}</div>
  </div>
</div>

<div class="bloc" id="finistere-sud">
  <div class="conteneur">
    <h2>Centre et Sud Finistère</h2>
    <div class="bassins">${cartesBassins(['centre-et-sud-finistere'])}</div>
    <p class="intro">Quimper, Châteaulin, Crozon, Carhaix, Douarnenez, pays Bigouden, Concarneau, Quimperlé : le détail par commune est sur la page dédiée.</p>
  </div>
</div>

<div class="bloc bloc-creme" id="eleveurs">
  <div class="conteneur prose-page">
    <div class="prose">
      <h2>Éleveurs et professionnels de Bretagne</h2>
      <p>Nous travaillons avec des éleveurs du Léon, du Pays des Abers, de la Côte des Légendes et du pays de Landerneau-Daoulas, pour l'abattage et la découpe à façon de leurs animaux destinés à la vente directe.</p>
      <p>Vous êtes éleveur ailleurs dans le Finistère, dans les Côtes-d'Armor ou dans le Morbihan ? <a href="${urlBretagne}">Temps de route et conditions pour les éleveurs de Bretagne</a>.</p>
      <p><a class="btn btn-plein" href="/contact/#professionnel">Demander un devis professionnel</a></p>
    </div>
  </div>
</div>
${appel()}
`,
};

export default [hub, ...pagesBassins, pageBretagne];
