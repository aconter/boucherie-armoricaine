# Audit initial : boucheriearmoricaine.com

Date : 11 novembre 2026
Périmètre : dépôt Git local (`main`, commit `e8b70a4`) et site en ligne.

## 0. Méthode et outils réellement utilisés

| Outil | Usage | Résultat |
|---|---|---|
| Lecture du code source | Toutes les pages HTML, `style.css`, `script.js`, `robots.txt`, `sitemap.xml`, `CNAME` | Fait |
| `curl` | Codes HTTP, redirections, en-têtes, comparaison site en ligne / dépôt | Fait |
| Chrome DevTools MCP : Lighthouse (mobile) | Accessibilité, bonnes pratiques, SEO | Fait sur l'accueil uniquement |
| Chrome DevTools MCP : trace de performance | Mobile 412 px, CPU x4, réseau « Slow 4G », cache vidé | Fait sur l'accueil uniquement |
| Chrome DevTools MCP : capture d'écran mobile | 390 x 844 | Fait sur l'accueil |
| Document existant `Audit SEO Boucherie Armoricaine.docx` (octobre 2026) | Concurrence, fiche Google, constats antérieurs | Lu et pris en compte |

Non réalisé à ce stade : tests Firefox / Safari, tests des pages secondaires sous Lighthouse, vérification de la fiche Google Business Profile (aucun accès), données Search Console (aucun accès). Aucun formulaire n'a été envoyé.

## 1. État des lieux

### 1.1 Hébergement et déploiement

- Site statique HTML/CSS/JS, sans outil de build, hébergé sur **GitHub Pages** (`aconter/boucherie-armoricaine`, domaine via `CNAME`), derrière **Cloudflare**.
- Le site en ligne correspond exactement au commit `e8b70a4` (seules différences : obfuscation de l'email ajoutée par Cloudflare).
- Pas de backend, pas de PHP, pas de base de données. Formulaire envoyé à **Formspree** (`formspree.io/f/xjggrpbg`).
- Dossier `mentions-legales/` présent en local mais **non commité** : la page renvoie **404** en ligne.
- Dossier `.claude/worktrees/` (4 copies anciennes du site) non suivi et absent de `.gitignore`.

### 1.2 Pages existantes

| URL | Title | H1 | Mots (approx.) | Indexable |
|---|---|---|---|---|
| `/` | Boucherie Armoricaine Lesneven, Abattage et découpe de viande (29) | Boucherie Armoricaine, Découpe et Colis de Viande, Finistère Nord : Lesneven | ~700 | Oui |
| `/decoupe-viande-particuliers/` | Découpe de viande pour particuliers à Lesneven | Idem | ~450 | Oui |
| `/abattage-decoupe-eleveurs/` | Abattage et découpe à façon pour éleveurs | Idem | ~400 | Oui |
| `/faq/` | Questions fréquentes | Questions fréquentes | ~400 | Oui |
| `/mentions-legales/` | Mentions légales | Mentions légales | ~250 | `noindex`, **404 en ligne** |

### 1.3 Informations commerciales confirmées par le site actuel

Ces informations sont les seules considérées comme fiables. Toute autre information devra être validée par le responsable.

- Raison sociale : SARL Kig Armor, nom commercial Boucherie Armoricaine.
- Adresse : 23 rue d'Arvor, 29260 Lesneven, sur le site de l'abattoir de Lesneven.
- Téléphone : 02 98 21 08 99. Email : contact@boucheriearmoricaine.com.
- Horaires : lundi à vendredi 9h-17h, samedi 9h-12h, fermé le dimanche.
- Paiement : espèces, carte bancaire.
- Espèces : bœuf, veau, porc, agneau (ovin), chevreau (caprin), porcelet.
- Prestations : abattage, découpe à façon (frais ou sous vide), hachage, saucisserie (saucisses, chipolatas, merguez), mise sous vide, congélation, cartons, PAD, semi-paré, destruction des os, porcelet saumuré.
- Particuliers : abattage et découpe de leur animal ; vente de colis au détail à partir de 1 kg ; sous vide et congélation offerts sur les colis.
- Tarifs pro HT « 2026 » et tarifs colis TTC « Avril 2026 » (voir `index.html` lignes 327 à 519).

Informations **non présentes** sur le site et donc à ne pas inventer : délais, jours d'abattage, documents à fournir, conditions de transport des animaux, livraison, poids minimum, certifications, labels, origine de la viande des colis, zone de clientèle des éleveurs hors Nord Finistère.

## 2. Problèmes identifiés, par priorité

Échelle : **P1** bloquant ou fort impact, **P2** impact notable, **P3** amélioration.

### 2.1 SEO technique

| # | Prio | Constat | Preuve |
|---|---|---|---|
| T1 | P1 | `http://boucheriearmoricaine.com/` répond **200** sans redirection vers HTTPS : deux versions du site accessibles. | `curl -I` : `HTTP/1.1 200 OK` sur http |
| T2 | P1 | `/mentions-legales/` en **404** en ligne (fichier non commité) et page orpheline (liée seulement depuis elle-même). Mentions incomplètes (`[À COMPLÉTER]` : SIRET, RCS, capital, TVA, directeur de publication). Obligation LCEN. | `mentions-legales/index.html:84-87` |
| T3 | P2 | `/index.html` répond 200 (doublon de `/`). Atténué par la canonical, acceptable. | `curl -I` |
| T4 | P2 | Pas de page 404 personnalisée (`404.html` absent) : un visiteur perdu n'a ni téléphone ni navigation. | |
| T5 | P2 | Sitemap incomplet (mentions légales absentes, normal en `noindex`) ; `priority` ignorée par Google ; pas d'images. Correct sinon. | `sitemap.xml` |
| T6 | P2 | Données structurées : `ButcherShop` correct sur l'accueil mais `areaServed` liste 21 communes (signal faible, voire perçu comme bourrage) ; un `Product` sans `offers`/prix dans `hasOfferCatalog` (non conforme pour un résultat enrichi) ; `logo` en AVIF (Google recommande PNG/JPG/WebP/SVG) ; aucun schema `Organization`/`WebSite` ; pages internes sans référence à l'entreprise (`@id`). | `index.html:27-202` |
| T7 | P3 | `FAQPage` : depuis 2023, Google n'affiche plus les résultats enrichis FAQ que pour des sites gouvernementaux ou de santé. Le balisage reste valide mais n'apporte rien en affichage. À conserver (sans effet négatif) ou retirer pour simplifier. | `faq/index.html:38-125` |
| T8 | P3 | Pages internes : pas de `og:image:width/height`, pas de `twitter:title/description/image`. | |
| T9 | P3 | `README.md` encodé en UTF-16 avec un seul titre. | |

### 2.2 SEO contenu et architecture

| # | Prio | Constat |
|---|---|---|
| C1 | P1 | **Une seule page « particuliers »** pour toutes les espèces et intentions : « faire découper son cochon », « découpe agneau », « demi-bœuf », « colis de viande » visent tous la même URL. Les colis n'ont pas de page propre (ancre `/#tarifs-particuliers`). |
| C2 | P1 | Les **tarifs de découpe pour particuliers** ne sont pas affichés : la page particuliers renvoie vers la grille **HT pro** (`decoupe-viande-particuliers/index.html:102`). Un particulier ne sait pas si ces prix s'appliquent à lui, ni le TTC. À clarifier avec le responsable. |
| C3 | P1 | Contenu pratique manquant : préparation et arrivée de l'animal, documents, délais, rendement, conservation, différences frais / sous vide / congelé. Ce sont exactement les questions des recherches visées. Ces informations doivent être fournies par l'entreprise. |
| C4 | P2 | **Stratégie géographique** : listes de communes dans plusieurs paragraphes et dans le schema, sans contenu utile par zone. Aucune page de zone. Rien pour les éleveurs des Côtes-d'Armor et du Morbihan (la page éleveurs ne parle que du Nord Finistère). |
| C5 | P2 | Accueil : les tarifs pro et particuliers y sont intégralement dupliqués avec `/abattage-decoupe-eleveurs/` (même tableau dans deux fichiers : risque d'incohérence lors des mises à jour, et contenu dupliqué). |
| C6 | P2 | H1 de l'accueil en trois morceaux (« Boucherie Armoricaine, Découpe et Colis de Viande, Finistère Nord : Lesneven ») : lisible mais peu naturel ; ne mentionne ni l'abattage ni les deux publics. |
| C7 | P2 | Aucune photo indexable (image de fond CSS uniquement, `3357.avif` de 888 Ko non utilisée). Aucun visuel de l'atelier, des produits ou des colis. |
| C8 | P3 | Emojis dans les titres de tarifs (`🐄 Bœuf`, `🐷 Porc`, `🐽`, `🌿`) : rendu variable selon les appareils, peu professionnel. |
| C9 | P3 | Promesse « Réponse sous 24h » dans le formulaire : engagement à confirmer par l'entreprise. |

### 2.3 Conversion et parcours

| # | Prio | Constat |
|---|---|---|
| U1 | P1 | **Aucun numéro de téléphone visible** dans l'en-tête ni dans le premier écran mobile (capture 390 px : logo, slogan, H1, deux boutons « Tarifs professionnels » et « Colis particuliers »). Le téléphone n'apparaît qu'en bas de l'accueil. Le pied de page n'en contient pas. |
| U2 | P1 | Les deux parcours « particulier » et « éleveur / professionnel » ne sont pas posés clairement : le premier bouton du hero est « Tarifs professionnels », alors que le public particulier est le plus nombreux. |
| U3 | P2 | Un seul formulaire générique, caché dans une bulle flottante. Pas de champ « type de demande », espèce, quantité. Pas de protection antispam (aucun champ `_gotcha` Formspree), pas de page ou message de confirmation personnalisé (redirection vers la page Formspree par défaut). |
| U4 | P2 | Pied de page pauvre : ni téléphone, ni horaires, ni liens de navigation, ni lien vers les mentions légales (sauf sur la page mentions elle-même). |
| U5 | P3 | Pas de fil d'Ariane visible cohérent avec un vrai `nav` (simple paragraphe). |

### 2.4 Code, accessibilité, sécurité

| # | Prio | Constat | Preuve |
|---|---|---|---|
| A1 | P1 | Bouton du menu mobile = `<div onclick>` : **inaccessible au clavier** et aux lecteurs d'écran (pas de `button`, pas d'`aria-expanded`). | `index.html:229` (toutes pages) |
| A2 | P2 | Accueil sans `<main>` (Lighthouse `landmark-one-main`). | Lighthouse |
| A3 | P2 | Ordre des titres : `h2` puis `h4` (Lighthouse `heading-order`). | `index.html:544, 583` |
| A4 | P2 | `aria-label` du logo différent du texte visible (Lighthouse `label-content-name-mismatch`). | `index.html:214` |
| A5 | P2 | Contenus masqués par `opacity:0` jusqu'au défilement (`.scroll-animate`) : si le JS échoue ou est lent, sections invisibles ; grand bloc noir sous le hero à l'ouverture (capture). Pas de prise en compte de `prefers-reduced-motion`. | `style.css:46-53` |
| A6 | P2 | Champs de formulaire sans `autocomplete` (console Chrome : 3 éléments). | Console |
| A7 | P2 | Le formulaire flottant a `role="dialog"` sans gestion du focus, ni fermeture par Échap, ni `aria-modal`. | `script.js:14-29` |
| A8 | P3 | Gestionnaires `onclick` en ligne dans le HTML ; en-tête, menu, pied de page et formulaire **copiés à l'identique dans 5 fichiers** (maintenance difficile, sources d'écarts). | |
| A9 | P3 | Images du pied de page sans `width`/`height`. | |
| S1 | OK | Aucune clé API ni secret dans le code. L'identifiant Formspree est public par nature. Liens externes en `rel="noopener"`. | `grep` |
| S2 | P3 | Pas d'en-têtes de sécurité (CSP, etc.) : non configurable sur GitHub Pages, possible via Cloudflare. Risque faible pour un site statique. | |
| S3 | P3 | Script Trustindex tiers chargé sur l'accueil (dépendance externe non versionnée). Utile pour les avis, à conserver mais à charger après le contenu. | `index.html:527` |

### 2.5 Performance (accueil, mobile simulé)

Mesure en laboratoire (CPU x4, Slow 4G, cache vide) : **LCP 5,6 s** (seuil « bon » : 2,5 s), CLS 0,00. Pas de données réelles CrUX (trafic trop faible).

Décomposition du LCP : TTFB 566 ms, **délai de découverte 2 147 ms**, téléchargement 1 961 ms, **délai de rendu 928 ms**.

Causes identifiées :

1. Image du hero (`hero-1920.avif`, 175 Ko, 1920 px) déclarée en fond CSS : le navigateur ne la découvre qu'après avoir téléchargé et lu `style.css`. Pas de version mobile.
2. Titre et boutons du hero animés depuis `opacity:0` avec délais (0,2 à 0,8 s) : retard de rendu volontaire.
3. Google Fonts bloquant le rendu (2 familles, 8 graisses) : gain estimé FCP 541 ms.
4. Cache court imposé par GitHub Pages (`max-age=600`) : 361 Ko recachables. Ajustable via une règle Cloudflare.
5. Images non utilisées dans le dépôt : `3357.avif` (888 Ko), `logo.avif`, `logo-blanc.avif`, `logo-blanc.png` (217 Ko). Sans impact sur le chargement, mais à nettoyer après confirmation.

Lighthouse mobile (accueil) : Accessibilité 96, Bonnes pratiques 100, SEO 100. Ces scores « techniques » sont bons : la marge de progression est sur le **contenu, l'architecture, la conversion et le LCP**, pas sur les balises de base.

### 2.6 Référencement local (rappel de l'audit d'octobre 2026, non revérifié)

- Fiche Google en **doublon** probable (« Atelier de découpe Vivien », même adresse et même téléphone) et fiche « Abattoir Public » à la même adresse. Signaux dispersés.
- 14 avis contre 40 à 215 pour les boucheries voisines : sur « boucherie + commune », le site ne peut pas gagner ; l'opportunité est sur **« découpe / abattage / à façon »**, où la concurrence locale est quasi inexistante.
- La requête « boucherie armoricaine » remonte d'abord la race bovine Armoricaine.

## 3. Opportunités

1. Requêtes « faire découper son cochon / agneau / demi-bœuf + Finistère » : peu de concurrence, et l'entreprise est l'une des seules à publier des tarifs.
2. Requêtes éleveurs « découpe à façon / prestataire découpe vente directe + Bretagne / 29 / 22 / 56 » : pages de service riches (PAD, semi-paré, tarifs HT, déroulé) plutôt que des pages de villes.
3. Un vrai parcours téléphone sur mobile : c'est le principal levier de conversion pour ce métier.
4. Contenu pratique (préparation de l'animal, rendement, conservation, kig ha farz, porcelet pour cochon grillé) : unique et utile, difficile à copier par les concurrents.
5. Fiche Google : dédoublonnage et campagne d'avis (QR code sur les colis).

## 4. Risques

| Risque | Mesure |
|---|---|
| Inventer des informations réglementaires ou commerciales (délais, documents, transport, zone pro) | Liste de questions au responsable (voir `PLAN_ACTIONS.md`), contenus marqués « à valider » tant que non confirmés |
| Pages de villes dupliquées pénalisées | Pages par bassin de vie, pas par commune, et seulement si le contenu est réellement spécifique |
| Changement d'URL cassant le référencement acquis | Conserver les 4 URL actuelles, n'ajouter que de nouvelles pages |
| Tarifs incohérents entre pages | Une seule source pour chaque grille |
| Mise en ligne involontaire | GitHub Pages publie `main` automatiquement : travailler sur une branche, aucune fusion ni `push` sans accord |
