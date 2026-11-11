import { entreprise as E } from '../data/entreprise.mjs';
import { picture, tel, esc, horairesHtml, adresseHtml, appel, schemaEntreprise, SITE_ID, ENTREPRISE_ID } from '../layout.mjs';

const hero = `<section class="hero" aria-labelledby="titre-accueil">
  ${picture({
    name: 'atelier-carcasses',
    alt: "Carcasses de bœuf suspendues en chambre froide, sur le site de l'abattoir de Lesneven",
    // Sur mobile la photo est sous un voile sombre : une image plus légère suffit.
    sizes: '(max-width: 47.99rem) 60vw, 100vw',
    width: 2000,
    height: 1126,
    eager: true,
    cls: 'hero-photo',
  })}
  <div class="conteneur hero-texte">
    <h1 id="titre-accueil">Abattage et découpe de viande à Lesneven</h1>
    <p class="hero-chapo">Sur le site de l'abattoir de Lesneven, nous abattons et découpons le bœuf, le veau, le porc, l'agneau et le chevreau des particuliers et des éleveurs du Nord Finistère. Nous vendons aussi des colis de viande au détail, dès 1 kg.</p>
    <div class="boutons">
      ${tel(`Appeler le ${E.telephone}`, 'btn btn-plein')}
      <a class="btn btn-contour-clair" href="/tarifs/">Voir les tarifs</a>
    </div>
    <p class="hero-adresse">${esc(E.adresse.rue)}, ${esc(E.adresse.codePostal)} ${esc(E.adresse.ville)}. Du lundi au vendredi de 9h&nbsp;à&nbsp;17h, le samedi de 9h&nbsp;à&nbsp;12h.</p>
  </div>
</section>`;

export default {
  url: '/',
  accueil: true,
  title: 'Abattage et découpe de viande à Lesneven (29) | Boucherie Armoricaine',
  description:
    "Abattage et découpe de bœuf, porc, agneau pour particuliers et éleveurs, sur le site de l'abattoir de Lesneven (29). Colis de viande dès 1 kg. Tarifs en ligne.",
  hero,
  schema: [
    schemaEntreprise(),
    { '@type': 'WebSite', '@id': SITE_ID, url: `${E.url}/`, name: E.nom, inLanguage: 'fr-FR', publisher: { '@id': ENTREPRISE_ID } },
  ],
  body: `
<section class="bloc parcours" aria-labelledby="parcours-titre">
  <div class="conteneur">
    <h2 id="parcours-titre" class="visually-hidden">Choisissez votre parcours</h2>
    <div class="parcours-grille">
      <article class="parcours-carte">
        <h3>Vous êtes un particulier</h3>
        <p>Vous avez élevé un cochon, un agneau ou un bœuf : nous l'abattons et le découpons selon vos souhaits, en frais ou sous vide. Pas d'animal ? Achetez nos colis de bœuf, de porc et de saucisserie.</p>
        <ul class="liens-liste">
          <li><a href="/decoupe-viande-particuliers/">Faire découper votre animal</a></li>
          <li><a href="/decoupe-cochon/">Cochon, demi-porc et porcelet</a></li>
          <li><a href="/colis-de-viande/">Colis de viande et prix TTC</a></li>
        </ul>
      </article>
      <article class="parcours-carte parcours-pro">
        <h3>Vous êtes éleveur ou professionnel</h3>
        <p>Abattage et découpe à façon pour votre vente directe : découpe selon vos fiches, saucisserie, mise sous vide, cartons, PAD et semi-paré.</p>
        <ul class="liens-liste">
          <li><a href="/abattage-decoupe-eleveurs/">Découpe à façon pour éleveurs</a></li>
          <li><a href="/tarifs/#professionnels">Tarifs professionnels HT</a></li>
          <li><a href="/contact/#professionnel">Demander un devis</a></li>
        </ul>
      </article>
    </div>
  </div>
</section>

<section class="bloc" aria-labelledby="atelier-titre">
  <div class="conteneur deux-colonnes">
    <div class="prose">
      <h2 id="atelier-titre">Abattu et découpé au même endroit</h2>
      <p>La Boucherie Armoricaine (SARL Kig Armor) est installée au 23 rue d'Arvor, sur le site de l'abattoir de Lesneven. Vos animaux sont abattus et découpés sur place, sans transport de carcasse.</p>
      <p>Nous travaillons le bœuf, le veau, le porc, l'agneau et le chevreau. Chaque pièce est découpée selon vos consignes, en frais ou sous vide pour une meilleure conservation.</p>
      <p>Nos clients viennent de tout le Nord Finistère : Côte des Légendes, Pays des Abers, Landerneau, Landivisiau et région de Brest. <a href="/zone-intervention/">Voir notre zone d'intervention</a>.</p>
    </div>
    <div class="prestations">
      <h3>Nos prestations</h3>
      <ul class="liste-coches">
        <li>Abattage et découpe à façon</li>
        <li>Découpe fraîche selon vos consignes</li>
        <li>Mise sous vide</li>
        <li>Hachage</li>
        <li>Saucisses, chipolatas et merguez</li>
        <li>Congélation</li>
        <li>Mise en cartons</li>
        <li>PAD et semi-paré</li>
        <li>Porcelet saumuré pour cochon grillé</li>
      </ul>
    </div>
  </div>
</section>

<section class="bloc bloc-creme" aria-labelledby="colis-titre">
  <div class="conteneur deux-colonnes">
    <div class="prose">
      <h2 id="colis-titre">Des colis de viande dès 1 kg</h2>
      <p>Bœuf, porc et saucisserie au détail, à partir de 1 kg. La mise sous vide et la congélation sont offertes. D'autres morceaux sont possibles sur demande, selon les volumes.</p>
      <p><a class="btn btn-plein" href="/colis-de-viande/">Voir les colis et les prix</a></p>
    </div>
    <div class="prose">
      <h2>Porcelet pour cochon grillé</h2>
      <p>Porcelet saumuré à partir de 20 kg. Comptez environ 500 g par personne pour un cochon grillé.</p>
      <p><a href="/decoupe-cochon/#porcelet">Tout savoir sur le porcelet</a></p>
    </div>
  </div>
</section>

<section class="bloc" id="avis" aria-labelledby="avis-titre">
  <div class="conteneur">
    <h2 id="avis-titre">Avis clients Google</h2>
    <div class="avis-widget">
      <script defer async src="https://cdn.trustindex.io/loader.js?${E.trustindexWidget}"></script>
      <div trustindex data-widget-id="${E.trustindexWidget}"></div>
    </div>
  </div>
</section>

<section class="bloc bloc-creme" aria-labelledby="infos-titre">
  <div class="conteneur infos-grille">
    <div>
      <h2 id="infos-titre">Nous trouver</h2>
      ${adresseHtml()}
      <p><a href="${E.googleMaps}" rel="noopener">Itinéraire avec Google Maps</a></p>
    </div>
    <div>
      <h3>Horaires</h3>
      ${horairesHtml()}
    </div>
    <div>
      <h3>Nous contacter</h3>
      <p class="tel-grand">${tel(E.telephone)}</p>
      <p><a href="mailto:${E.email}">${E.email}</a></p>
      <p><a href="/contact/">Formulaire de demande</a></p>
    </div>
  </div>
</section>
${appel()}
`,
};
