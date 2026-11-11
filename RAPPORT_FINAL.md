# Rapport final : refonte boucheriearmoricaine.com

Date : 11 novembre 2026. Branche Git : `refonte`. **Non publié** : rien n'est commité ni poussé, `main` (site en ligne) est intact.

## 1. Synthèse

- Site passé d'une page d'accueil chargée et trois pages secondaires à **9 pages indexables** organisées autour de deux parcours (particuliers, éleveurs).
- Tarifs, coordonnées et horaires centralisés dans **une seule source** (`_src/data/`), régénérés par `npm run build`.
- Téléphone cliquable visible en permanence (barre en bas d'écran sur mobile, bouton dans l'en-tête sur ordinateur).
- Nouvelle identité visuelle sobre : fonds clairs pour lire, grilles de prix présentées comme des ardoises de boucher, bordeaux pour les actions.
- Lighthouse mobile 100 / 100 / 100 sur les 4 pages auditées ; LCP mobile simulé 5,6 s vers 3,4 s.

## 2. Pages

| URL | Statut | Contenu |
|---|---|---|
| `/` | Refaite | H1 explicite, adresse, téléphone, deux parcours, prestations, colis, avis, infos pratiques |
| `/decoupe-viande-particuliers/` | Refaite (URL conservée) | Déroulé, sections par espèce, préparations, renvoi tarifs |
| `/decoupe-cochon/` | **Nouvelle** | Cochon, kig ha farz, saucisserie, grille porc, porcelet saumuré |
| `/colis-de-viande/` | **Nouvelle** (remplace l'ancre `/#tarifs-particuliers`) | Prix TTC, offerts, comment commander |
| `/abattage-decoupe-eleveurs/` | Refaite (URL conservée) | Déroulé, PAD / semi-paré, tarifs HT, devis |
| `/tarifs/` | **Nouvelle** | Grilles HT et TTC séparées, date de mise à jour |
| `/zone-intervention/` | **Nouvelle** | Bassins de vie du Nord Finistère, section éleveurs |
| `/faq/` | Refaite (URL conservée) | 12 questions (3 nouvelles), liens vers les pages |
| `/contact/` | **Nouvelle** | Téléphone, adresse, horaires, deux formulaires, plan |
| `/mentions-legales/` | Ajoutée au dépôt | `noindex`, **champs à compléter** |
| `/404.html` | **Nouvelle** | Téléphone et liens utiles |

Aucune URL existante supprimée : aucune redirection nécessaire.

## 3. Fichiers

**Ajoutés**

- `_src/build.mjs` : générateur (Node, sans dépendance).
- `_src/layout.mjs` : gabarit commun (en-tête, pied, ardoises de prix, schema).
- `_src/data/tarifs.json` : toutes les grilles de prix et leur date.
- `_src/data/entreprise.mjs` : coordonnées, horaires, navigation.
- `_src/pages/*.mjs` : une page par fichier.
- `assets/css/site.css`, `assets/js/site.js`.
- `assets/img/` : photo de l'atelier en AVIF et WebP (640 à 2000 px), logo 160 / 320 px, logo PNG 512 px pour Google.
- `assets/fonts/` : Playfair Display et Source Sans 3 auto-hébergées (WOFF2 latin, 67 Ko au total).
- `tests/verifier.mjs` : vérification statique.
- `package.json`, `_config.yml` (empêche la publication des documents internes), `.gitignore`.
- Documents : `AUDIT_INITIAL.md`, `PLAN_ACTIONS.md`, `STRATEGIE_SEO.md`, `STRATEGIE_LOCALE.md`, `TESTS_EFFECTUES.md`, ce rapport.

**Régénérés** : `index.html`, `decoupe-viande-particuliers/index.html`, `abattage-decoupe-eleveurs/index.html`, `faq/index.html`, `sitemap.xml`.

**Supprimés** : `style.css`, `script.js` (remplacés par `assets/css/site.css` et `assets/js/site.js`).

**Conservés sans modification** : `CNAME`, `robots.txt`, `google2827cbc476b84fd3.html` (vérification Search Console), favicons, `og-boucherie-armoricaine.jpg`, logos et images d'origine (dont les images inutilisées, en attente de décision).

## 4. Problèmes corrigés

| Audit | Correction |
|---|---|
| U1 Téléphone absent du premier écran | Bouton d'appel dans le hero, barre d'appel fixe sur mobile, en-tête sur ordinateur, pied de page |
| U2 Parcours non distingués | Deux cartes « particulier » / « éleveur ou professionnel » sous le hero |
| U3 Formulaire unique sans antispam | Deux formulaires, validation accessible, champ piège `_gotcha`, confirmation sur la page |
| U4 Pied de page pauvre | Coordonnées, horaires, liens vers toutes les pages, mentions légales |
| C1 Une page pour tout | Pages porc, colis, tarifs, zone, contact |
| C5 Tarifs dupliqués à la main | Une seule source `tarifs.json` |
| C6 H1 de l'accueil | « Abattage et découpe de viande à Lesneven » |
| C7 Aucune photo indexable | Photo de l'atelier en `<img>` avec texte alternatif |
| C8 Emojis | Supprimés |
| C9 « Réponse sous 24h » | Retiré (engagement non confirmé) |
| T2 Mentions légales 404 et orphelines | Ajoutées au dépôt et liées depuis toutes les pages (à compléter) |
| T4 Pas de page 404 | `404.html` |
| T6 Schema | Graphe relié par `@id`, `Product` sans prix retiré, logo PNG, `Service` par prestation |
| T8 Open Graph incomplet | Complet sur toutes les pages |
| A1 Menu au clavier | Vrai `<button>`, `aria-expanded`, Échap |
| A2 à A4 Lighthouse | `<main>`, ordre des titres, libellé du logo |
| A5 Contenu masqué par animations | Animations supprimées, `prefers-reduced-motion` respecté |
| A6 `autocomplete` | Ajouté |
| A7 Dialogue sans gestion du focus | Formulaire flottant remplacé par la page contact |
| A8 Code dupliqué, `onclick` | Gabarit unique, plus de JS en ligne |
| Perf | Image hero en `<img>` prioritaire et responsive, polices locales préchargées, plus d'animation sur le premier écran |

## 5. Points restant à traiter

**Bloquants avant mise en ligne**

1. Compléter les mentions légales (SIRET, RCS, capital, TVA, directeur de publication) dans `_src/pages/mentions.mjs`.
2. Faire relire par le responsable : tous les textes, les deux grilles de tarifs (inchangées, reprises telles quelles), la page zone.

**Dépendants des réponses du responsable** (`PLAN_ACTIONS.md`, section 1)

3. Tarif de découpe pour particuliers.
4. Déroulé précis (délais, documents, jours d'abattage) puis pages bœuf / veau et agneau / chevreau.
5. Éleveurs des Côtes-d'Armor et du Morbihan.
6. Photos supplémentaires.
7. Suppression des images inutilisées (`3357.avif` 888 Ko, `logo.avif`, `logo-blanc.avif`, `logo-blanc.png`, `hero-1920.avif`).

**Hors site** (recommandations dans `STRATEGIE_LOCALE.md`)

8. ~~Redirection HTTPS~~ : **fait le 11/11/2026** (Cloudflare « Toujours utiliser HTTPS »). Vérifié : `http://` répond 301 vers `https://`, une seule redirection, pas de boucle. HSTS laissé désactivé volontairement.
9. Allonger le cache Cloudflare sur `/assets/*`.
10. Fiche Google en doublon, campagne d'avis, citations.

## 6. Limites

- Tests uniquement sous Chrome (voir `TESTS_EFFECTUES.md`).
- Le formulaire n'a jamais été réellement envoyé.
- Le contenu des pages n'ajoute aucune information non présente sur l'ancien site, sauf des reformulations et des déductions directes (par exemple le déroulement éleveurs, construit à partir des phrases existantes). Il reste donc limité sur les délais et conditions pratiques tant que le responsable ne les a pas fournis.

## 7. Maintenance

Modifier un prix : éditer `_src/data/tarifs.json` (et `mise_a_jour`), puis :

```bash
npm run build
```

```bash
node tests/verifier.mjs
```

Les fichiers HTML à la racine sont générés : ne pas les modifier à la main.
