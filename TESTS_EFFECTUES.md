# Tests effectués

Date : 11 novembre 2026. Branche `refonte`, site servi en local (`python -m http.server 8080`).
Seuls les tests listés ici ont été exécutés.

## 1. Vérification statique automatisée

Commande : `node tests/verifier.mjs` (script fourni, sans réseau).

Contrôles : un H1 par page, ordre des titres sans saut, title et meta description (longueur, unicité), canonical, `lang`, présence de `<main>`, absence de `onclick`, JSON-LD valide, `alt` et dimensions sur toutes les images, existence de toutes les ressources (`src`, `srcset`, `link`), liens `tel:` (tous `+33298210899`), liens internes, ancres internes, URL du sitemap, pages orphelines, texte « À COMPLÉTER ».

Résultat : **11 pages, 302 liens internes, 9 URL dans le sitemap, 0 erreur.**
Avertissements attendus : `noindex` sur `/404.html` et `/mentions-legales/` ; champs `[À COMPLÉTER]` dans les mentions légales.

## 2. Lighthouse (Chrome DevTools MCP, mobile, serveur local)

| Page | Accessibilité | Bonnes pratiques | SEO | Audits en échec |
|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 0 |
| `/contact/` | 100 | 100 | 100 | 0 |
| `/tarifs/` | 100 | 100 | 100 | 0 |
| `/faq/` | 100 | 100 | 100 | 0 |

Avant refonte (site en ligne, accueil) : accessibilité 96, 3 audits en échec (`heading-order`, `label-content-name-mismatch`, `landmark-one-main`).
Non audités sous Lighthouse : `/decoupe-viande-particuliers/`, `/decoupe-cochon/`, `/colis-de-viande/`, `/abattage-decoupe-eleveurs/`, `/zone-intervention/` (même gabarit, couverts par la vérification statique).

## 3. Performance (trace Chrome, accueil)

Conditions identiques avant / après : 412 x 915, DPR 2,6, CPU x4, réseau « Slow 4G », cache vidé.

| Mesure | Avant (site en ligne) | Après (local) |
|---|---|---|
| LCP | 5 601 ms | **3 442 ms** |
| Délai de découverte de l'image LCP | 2 147 ms | 157 ms |
| CLS | 0,00 | 0,00 |

Limites : le serveur local ne compresse pas le HTML (GitHub Pages le fait) et n'est pas derrière Cloudflare ; les deux mesures ne sont donc pas strictement comparables. Le LCP reste au-dessus de 2,5 s en « Slow 4G » : le temps restant est surtout le téléchargement de l'image du hero et des polices. Une mesure sur le site publié (PageSpeed Insights) sera nécessaire après mise en ligne.

## 4. Formulaires (sans aucun envoi réel)

`window.fetch` remplacé par une fonction de test avant le chargement de la page. Le relevé réseau confirme **aucune requête vers formspree.io**.

| Scénario | Résultat |
|---|---|
| Envoi du formulaire particulier vide | Bloqué, 4 messages d'erreur, focus sur le premier champ, message global |
| Téléphone « 123 » | Bloqué, message « Indiquez un numéro de téléphone à 10 chiffres », `aria-invalid` et `aria-describedby` posés |
| Formats acceptés | « 06-12-34-56-78 » et « (02) 98.21.08.99 » valides |
| Formulaire particulier valide, serveur simulé OK | Message de confirmation, formulaire vidé, champs envoyés : `_subject`, `type_demande`, `nom`, `telephone`, `email`, `objet`, `espece`, `message`, `_gotcha` |
| Champ piège `_gotcha` rempli | Aucun envoi |
| Formulaire pro, email invalide | Bloqué, message de format |
| Formulaire pro valide, serveur simulé en erreur 500 | Message d'échec avec le téléphone, bouton réactivé |

Anomalie trouvée et corrigée pendant les tests : le motif du champ téléphone était invalide pour Chrome (mode `v` des expressions régulières) et donc ignoré ; « 123 » était accepté. Corrigé dans `_src/pages/contact.mjs`.

Non testé : le comportement réel de Formspree (réception de l'email, filtre antispam côté Formspree). À vérifier par le responsable avec un envoi réel volontaire après mise en ligne.

## 5. Navigation et clavier

- Menu mobile : ouverture par le bouton (`aria-expanded="true"`), fermeture par Échap (`aria-expanded="false"`, focus rendu au bouton). Vérifié par script.
- Lien d'évitement « Aller au contenu » présent sur toutes les pages (vérifié dans le HTML).
- Navigation complète au clavier non testée manuellement.

## 6. Affichage

- Débordement horizontal : aucun, sur les 11 pages à 320, 390, 768, 1024 et 1440 px (contrôle par script).
- Captures examinées : accueil mobile 390 px, tarifs mobile 390 px, accueil desktop 1366 px, tarifs desktop 1280 px.
- Anomalie signalée par Antoine (capture, tarifs en 3 colonnes) : la ligne « Porcelet » débordait de l'ardoise à cause de `white-space: nowrap` sur les prix. Corrigé dans `assets/css/site.css`. Contrôle par script : aucune ardoise ne déborde sur `/tarifs/`, `/abattage-decoupe-eleveurs/`, `/colis-de-viande/`, `/decoupe-cochon/` à 320, 390, 768, 900, 1024, 1280 et 1440 px.
- Console : aucune erreur sur l'accueil ni sur la page contact.
- Widget d'avis Trustindex : chargé sans erreur, mais son contenu n'a pas pu être vérifié en local (il est probablement limité au domaine de production).

## 7. Non réalisé

- Firefox, Safari, Edge : non testés (seul Chrome était piloté dans cet environnement).
- Tablette réelle, smartphone réel.
- Validation W3C du HTML (pas de validateur disponible hors ligne) ; test Google « Résultats enrichis » sur les données structurées (nécessite le site en ligne).
- Redirections du site en ligne : inchangées, la refonte n'est pas publiée.
