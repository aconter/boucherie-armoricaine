import { entreprise as E } from '../data/entreprise.mjs';

const url = '/mentions-legales/';

// ATTENTION : les champs [À COMPLÉTER] doivent être renseignés par le responsable
// avant toute mise en ligne (obligation LCEN).
export default {
  url,
  noindex: true,
  title: 'Mentions légales | Boucherie Armoricaine',
  description: 'Mentions légales du site de la Boucherie Armoricaine, SARL Kig Armor, Lesneven.',
  h1: 'Mentions légales',
  ariane: [{ nom: 'Mentions légales', url }],
  body: `
<div class="bloc">
  <div class="conteneur prose-page">
    <div class="prose">
      <h2>Éditeur du site</h2>
      <p>${E.raisonSociale}, exploitant la ${E.nom}<br>
      ${E.adresse.rue}, ${E.adresse.codePostal} ${E.adresse.ville}<br>
      Téléphone : ${E.telephone}<br>
      Email : ${E.email}<br>
      Capital social : [À COMPLÉTER]<br>
      SIRET : [À COMPLÉTER], RCS Brest : [À COMPLÉTER]<br>
      N° TVA intracommunautaire : [À COMPLÉTER]<br>
      Directeur de la publication : [À COMPLÉTER]</p>

      <h2>Hébergement</h2>
      <p>GitHub Pages, service de GitHub, Inc.<br>88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis</p>

      <h2 id="donnees">Données personnelles</h2>
      <p>Les informations envoyées via les formulaires de contact (nom, téléphone, email, commune, message) servent uniquement à répondre à votre demande. Elles sont transmises par le service Formspree et ne sont ni revendues ni utilisées à des fins commerciales. Vous pouvez demander leur consultation ou leur suppression à l'adresse ${E.email}.</p>

      <h2>Services tiers</h2>
      <p>Ce site affiche une carte Google Maps (page contact) et des avis clients via Trustindex (page d'accueil). Ces services peuvent déposer des cookies selon leurs propres politiques.</p>

      <h2>Propriété intellectuelle</h2>
      <p>Les textes, photos et logos de ce site appartiennent à la ${E.nom}. Toute reproduction sans autorisation est interdite.</p>
    </div>
  </div>
</div>
`,
};
