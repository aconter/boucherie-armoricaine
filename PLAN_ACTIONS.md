# Plan d'actions : refonte boucheriearmoricaine.com

Date : 11 novembre 2026. Basé sur `AUDIT_INITIAL.md`.
Statut : **proposition, en attente de validation**. Rien n'est modifié sur le site tant que ce plan n'est pas validé.

## 1. Questions à faire valider par le responsable (bloquantes pour le contenu)

Sans réponse, les sections concernées ne seront pas rédigées (ou resteront marquées « à compléter »).

1. **Tarifs découpe particuliers** : un particulier qui amène son cochon paie-t-il la grille pro HT + TVA, ou une autre grille ? Quel taux de TVA ?
2. **Tarifs** : les grilles actuelles (pro « 2026 », colis « avril 2026 ») sont-elles toujours à jour ?
3. **Éleveurs des Côtes-d'Armor et du Morbihan** : acceptez-vous leurs animaux ? Qui assure le transport (l'éleveur, un transporteur) ? Y a-t-il un volume minimum ?
4. **Déroulé pratique** : jours d'abattage, délai entre la prise de rendez-vous et l'abattage, délai de découpe et de récupération, documents et identification demandés selon l'espèce, conditions d'arrivée de l'animal.
5. **Colis** : origine de la viande vendue au détail, retrait sur place uniquement ou livraison ? Commande par téléphone uniquement ?
6. **Fiche Google « Atelier de découpe Vivien »** : ancien exploitant ? Fiche à fermer ou fusionner ?
7. **Engagement « Réponse sous 24h »** du formulaire : à garder ?
8. **Mentions légales** : SIRET, RCS, capital, TVA intracommunautaire, directeur de publication.
9. **Photos** : disposez-vous de photos réelles (atelier, découpe, colis, équipe) utilisables sur le site ?
10. **Images inutilisées** (`3357.avif`, `logo.avif`, `logo-blanc.avif`, `logo-blanc.png`) : peut-on les retirer du dépôt ?

## 2. Architecture proposée

Les 4 URL actuelles sont conservées (pas de redirection nécessaire). Les nouvelles pages ne sont créées que si leur contenu est réellement distinct.

```
/                                   Accueil : qui, où, quoi, pour qui, téléphone. Deux parcours.
/decoupe-viande-particuliers/       Hub particuliers (existant, enrichi)
  /decoupe-porc-particuliers/       Cochon, demi-porc, porcelet saumuré, kig ha farz      [nouveau]
  /decoupe-agneau-chevreau/         Agneau, chevreau                                       [nouveau, si contenu validé]
  /decoupe-boeuf-veau/              Bœuf, demi-bœuf, quartier, veau                        [nouveau, si contenu validé]
/colis-de-viande/                   Colis et détail, tarifs TTC, modalités de commande     [nouveau, remplace l'ancre /#tarifs-particuliers]
/abattage-decoupe-eleveurs/         Hub pros (existant, enrichi) : déroulé, tarifs HT, PAD / semi-paré
/tarifs/                            Les deux grilles, HT et TTC clairement séparées, date de mise à jour  [nouveau]
/zone-intervention/                 Particuliers : bassins de vie du Finistère. Éleveurs : 29, 22, 56   [nouveau]
/faq/                               Existant, enrichi
/contact/                           Téléphone, horaires, plan, deux formulaires            [nouveau]
/mentions-legales/                  À compléter et publier
/404.html                           Page d'erreur utile (téléphone, liens)                  [nouveau]
```

Point d'attention : les pages espèces ne seront créées que si le responsable fournit de quoi les différencier (question 4). Sinon, une section par espèce dans le hub particuliers suffit.

## 3. Stratégie géographique (résumé, détail dans `STRATEGIE_LOCALE.md` à l'étape 2)

- **Pas de page par commune.** Une page `/zone-intervention/` structurée par bassin de vie, avec pour chacun : communes, distance et temps de trajet réels jusqu'à Lesneven, rappel que l'animal est amené à l'atelier de Lesneven, liens vers les prestations.
  - Pays de Lesneven et Côte des Légendes (Lesneven, Le Folgoët, Ploudaniel, Kerlouan, Guissény, Plounéour-Brignogan-Plages, Goulven, Kernilis...)
  - Pays des Abers (Plouguerneau, Lannilis, Landéda, Plabennec, Le Drennec...)
  - Brest et pays d'Iroise (Brest, Guipavas, Saint-Renan, Ploudalmézeau...)
  - Pays de Landerneau-Daoulas et Pays de Landivisiau
  - Haut-Léon (Plouescat, Plounévez-Lochrist...)
- **Éleveurs** : section distincte sur la même page (ou page dédiée si la question 3 le justifie) pour le Finistère, les Côtes-d'Armor et le Morbihan, formulée comme « nous accueillons les animaux d'éleveurs de... à notre atelier de Lesneven », sans laisser croire à une présence locale.
- Schema `areaServed` réduit au Finistère (particuliers) et aux trois départements (éleveurs, si validé).

## 4. Direction artistique proposée

- Palette : bordeaux profond (déjà `#8B1E3F`, conservé comme couleur de marque), crème / blanc cassé pour les fonds de lecture, anthracite pour le texte et les bandeaux, un ocre doux en accent unique. Fin du fond noir généralisé : fonds clairs pour les contenus longs (lisibilité), sombre réservé aux bandeaux d'appel et au pied de page.
- Typographie : conserver Playfair Display (titres) et Source Sans 3 (texte), réduites à 2 + 3 graisses, auto-hébergées en WOFF2 (plus de dépendance Google Fonts bloquante).
- Logo actuel conservé (pas de refonte d'identité sans demande explicite), en-tête plus compact.
- Suppression des emojis, des effets de halo sur le texte du hero et des animations d'apparition qui masquent le contenu. Animations légères seulement, désactivées si `prefers-reduced-motion`.
- Photos réelles en `<img>` (AVIF + WebP + JPG, tailles adaptées au mobile) si fournies.

## 5. UX et conversion

- En-tête : bouton **« Appeler »** permanent sur mobile (`tel:+33298210899`), menu en vrai `<button>` accessible.
- Accueil, premier écran : H1 explicite, adresse, et deux cartes **« Je suis un particulier »** / **« Je suis éleveur ou professionnel »**, plus le téléphone.
- Appels à l'action par page : « Appeler pour organiser une découpe », « Demander un devis professionnel », « Voir les tarifs », « Commander un colis ».
- Page contact avec **deux formulaires** (particulier / professionnel), champs minimaux, validation HTML5 + JS, champ piège antispam `_gotcha` (Formspree), message de confirmation sur le site. Le formulaire flottant devient un simple lien vers la page contact ou est supprimé (à arbitrer).
- Pied de page complet : coordonnées cliquables, horaires, liens principaux, mentions légales.

## 6. Plan technique

| Phase | Actions | Fichiers |
|---|---|---|
| 0. Préparation | Branche `refonte` dédiée, `.gitignore` (`.claude/`), commit des mentions légales | dépôt |
| 1. Correctifs rapides | Menu en `<button>`, `<main>` sur l'accueil, ordre des titres, `autocomplete`, footer avec téléphone et mentions, `404.html`, suppression des emojis | toutes les pages, `script.js`, `style.css` |
| 2. Performance | Hero en `<img>` avec `fetchpriority="high"` et `srcset`, suppression des animations sur le premier écran, polices auto-hébergées et préchargées, CSS réorganisé | `style.css`, accueil |
| 3. Factorisation | Choix à valider (voir ci-dessous) pour ne plus dupliquer en-tête, pied de page et tarifs | toutes les pages |
| 4. Contenu et pages | Nouvelles pages, réécriture, maillage interne, fil d'Ariane, tarifs uniques | nouvelles pages |
| 5. Données structurées | `ButcherShop` + `Organization`/`WebSite` reliés par `@id`, `Service` par prestation (avec `offers` uniquement là où un prix est affiché), `BreadcrumbList` partout, `Product` retiré | toutes les pages |
| 6. Tests | Liens, balises, schema, Lighthouse toutes pages, mobile / tablette / desktop, Chrome et Edge (Playwright et Chrome DevTools disponibles), formulaires en mode test sans envoi | `TESTS_EFFECTUES.md` |
| 7. Livrables | `STRATEGIE_SEO.md`, `STRATEGIE_LOCALE.md`, `RAPPORT_FINAL.md`, `TESTS_EFFECTUES.md` | racine |

**Décision technique à prendre (phase 3)** :

- Option A, recommandée : un petit générateur statique (script Node sans dépendance, ou Eleventy) qui assemble en-tête, pied de page et tableaux de tarifs depuis un seul fichier `tarifs.json`. Les fichiers HTML générés restent publiés tels quels sur GitHub Pages. Avantage : un tarif se change à un seul endroit, avec sa date de mise à jour.
- Option B : rester en HTML pur, en recopiant en-tête et pied de page dans chaque page (actuellement 5 copies, environ 12 après refonte). Plus simple, mais risque d'incohérences.

## 7. Actions hors site (recommandations, aucune action directe)

1. Fiche Google : vérifier et fermer ou fusionner le doublon « Atelier de découpe Vivien » ; catégorie principale cohérente avec le site ; services et horaires identiques au site ; photos réelles ; lien vers le site.
2. Avis : QR code vers le formulaire d'avis Google sur les colis et les factures ; demande systématique après une découpe. Aucun avis acheté ou rédigé.
3. Cohérence NAP (nom, adresse, téléphone) sur PagesJaunes, annuaires agricoles, site de la communauté de communes.
4. Cloudflare : activer « Always Use HTTPS » (ou « Enforce HTTPS » sur GitHub Pages) pour corriger l'accès en http ; règle de cache plus longue sur images, CSS et polices.
5. Search Console : soumettre le nouveau sitemap après mise en ligne, suivre les requêtes « découpe », « abattage », « à façon ».

## 8. Règles de travail

- Aucun `push`, aucune fusion dans `main`, aucune mise en ligne sans accord explicite (GitHub Pages publie `main` automatiquement).
- Aucun tarif ni information commerciale modifié sans validation.
- Aucun formulaire réellement envoyé pendant les tests.
