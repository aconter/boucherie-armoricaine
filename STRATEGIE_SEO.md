# Stratégie SEO : boucheriearmoricaine.com

Date : 11 novembre 2026. Complète `AUDIT_INITIAL.md` et `STRATEGIE_LOCALE.md`.

## 1. Principe

Ne pas se battre sur « boucherie + commune » : le site ne peut pas y gagner face aux boucheries de comptoir (14 avis contre 40 à 215). Viser les recherches de **service** où la concurrence est faible et où l'entreprise a un atout rare : des **tarifs publics** et un atelier **sur le site de l'abattoir**.

Deux audiences, deux zones :

| Audience | Intention | Zone visée |
|---|---|---|
| Particuliers | Faire découper son animal, acheter des colis | Nord Finistère, puis Finistère |
| Éleveurs et professionnels | Prestataire de découpe à façon pour la vente directe | Finistère, puis Côtes-d'Armor et Morbihan (après validation) |

## 2. Correspondance requêtes / pages

Une intention principale par page. Les requêtes proches sont couvertes par le contenu, sans répétition artificielle.

| Page | Requêtes principales | Requêtes secondaires |
|---|---|---|
| `/` | abattage découpe viande Lesneven, boucherie armoricaine | découpe viande Nord Finistère, abattoir Lesneven découpe |
| `/decoupe-viande-particuliers/` | découpe de viande pour particuliers Finistère, faire découper son animal | découpe bœuf particulier, faire découper son agneau, demi-bœuf |
| `/decoupe-cochon/` | faire découper son cochon Finistère, découpe porc particulier | demi-porc, abattage cochon, porcelet saumuré, cochon grillé, kig ha farz |
| `/colis-de-viande/` | colis de viande Lesneven / Finistère, vente viande au détail Lesneven | colis bœuf, colis porc, saucisses |
| `/abattage-decoupe-eleveurs/` | découpe à façon éleveur Bretagne / Finistère, abattage découpe vente directe | découpe carcasse, PAD, semi-paré, mise sous vide viande pro |
| `/tarifs/` | tarif découpe viande, prix découpe à façon, prix abattage porc | prix colis viande |
| `/zone-intervention/` | découpe viande + bassin (Abers, Côte des Légendes, Brest, Landerneau) | |
| `/faq/` | questions longue traîne (rendement, sous vide, PAD vs semi-paré) | |
| `/contact/` | adresse, horaires, téléphone Boucherie Armoricaine | |

Pages prévues mais **non créées** faute de contenu validé : `/decoupe-boeuf-veau/`, `/decoupe-agneau-chevreau/`, page éleveurs Côtes-d'Armor / Morbihan. Elles seront créées quand le responsable aura fourni de quoi les rendre réellement différentes (voir `PLAN_ACTIONS.md`, questions 3 et 4).

## 3. Balises et structure (appliqué)

- Title unique par page, 50 à 80 caractères, intention en tête, marque en fin (Google peut tronquer la marque, ce qui est acceptable).
- Meta description unique, 120 à 160 caractères, avec un fait utile (prix, dès 1 kg, tarifs en ligne).
- Un seul H1 par page, hiérarchie H2 / H3 sans saut (vérifié par `tests/verifier.mjs`).
- Canonical absolue sur chaque page, `noindex` sur les mentions légales et la 404.
- Fil d'Ariane visible et balisé (`BreadcrumbList`) sur toutes les pages internes.
- Open Graph complet (titre, description, image JPG 1200 x 630 avec dimensions).
- Photo réelle de l'atelier en `<img>` avec texte alternatif descriptif.

## 4. Données structurées (appliqué)

Un seul graphe `@graph` par page, entités reliées par `@id` :

- Accueil : `ButcherShop` (`#entreprise`) avec adresse, coordonnées GPS, horaires, téléphone, `hasMap`, logo PNG ; `WebSite` (`#site`).
- Pages de service : `Service` avec `provider` pointant vers `#entreprise` et `areaServed`.
- FAQ : `FAQPage` reprenant mot pour mot les réponses visibles. Google n'affiche plus ce résultat enrichi pour les commerces ; le balisage est conservé car il reste valide et sans risque.
- Contact : `ContactPage`.
- Retirés : le `Product` sans prix (non conforme), les 21 villes en `areaServed` (remplacées par le Finistère).
- Non utilisé : `Product` / `Offer` avec prix sur les colis. Possible plus tard, mais les prix au kilo par morceau ne se prêtent pas bien aux fiches produit de Google et imposeraient une maintenance stricte.

## 5. Maillage interne (appliqué)

- Accueil vers les deux hubs (particuliers, éleveurs), colis, porc, tarifs, zone, contact.
- Chaque page de service vers les tarifs, la FAQ et le contact (bandeau d'appel commun).
- Pied de page : liens vers toutes les pages indexables. Aucune page orpheline (vérifié).
- Ancres utiles : `/tarifs/#professionnels`, `/tarifs/#particuliers`, `/contact/#particulier`, `/contact/#professionnel`, `/decoupe-cochon/#porcelet`.

## 6. Contenu à produire (avec le responsable)

Par ordre d'impact :

1. Déroulé pratique précis : jours d'abattage, délais, documents et identification par espèce, conditions d'arrivée de l'animal.
2. Tarif de découpe pour particuliers (HT + TVA ou grille dédiée).
3. Bœuf et veau : demi-bœuf, quartier, exemples de découpe, conservation.
4. Agneau et chevreau : idem.
5. Éleveurs : volumes, fréquence, accueil des éleveurs des Côtes-d'Armor et du Morbihan, transport.
6. Photos réelles : atelier, découpe, colis sous vide, équipe.

## 7. Suivi

- Search Console (déjà vérifiée) : soumettre `sitemap.xml` après mise en ligne ; suivre les requêtes contenant « découpe », « abattage », « à façon », « cochon », « colis ».
- Revoir titles et descriptions à 3 mois selon les requêtes réelles.
