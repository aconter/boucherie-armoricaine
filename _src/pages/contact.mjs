import { entreprise as E } from '../data/entreprise.mjs';
import { tel, esc, horairesHtml, adresseHtml, ENTREPRISE_ID } from '../layout.mjs';

const url = '/contact/';

const piege = `<div class="piege" aria-hidden="true"><label>Ne pas remplir<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>`;
const statut = `<p class="form-statut" role="status" aria-live="polite"></p>`;
const rgpd = `<p class="form-note">Vos coordonnées servent uniquement à répondre à votre demande. <a href="/mentions-legales/#donnees">En savoir plus</a>.</p>`;

const champ = (id, label, input, aide = '') =>
  `<div class="champ"><label for="${id}">${label}</label>${input}${aide ? `<p class="aide" id="${id}-aide">${aide}</p>` : ''}<p class="erreur" id="${id}-erreur" hidden></p></div>`;

const formParticulier = `<form class="formulaire" action="${E.formspree}" method="POST" novalidate data-type="particulier">
  <input type="hidden" name="_subject" value="Demande particulier (site web)">
  <input type="hidden" name="type_demande" value="Particulier">
  ${champ('p-nom', 'Nom', '<input id="p-nom" name="nom" type="text" autocomplete="name" required maxlength="100">')}
  ${champ('p-tel', 'Téléphone', '<input id="p-tel" name="telephone" type="tel" autocomplete="tel" required pattern="[0-9 +.\\-\\(\\)]{10,20}" aria-describedby="p-tel-aide">', 'Pour vous rappeler. Exemple : 06 12 34 56 78')}
  ${champ('p-email', 'Email (facultatif)', '<input id="p-email" name="email" type="email" autocomplete="email" maxlength="150">')}
  ${champ('p-objet', 'Votre demande', `<select id="p-objet" name="objet" required>
      <option value="">Choisir</option>
      <option>Faire découper mon animal</option>
      <option>Commander un colis de viande</option>
      <option>Porcelet pour cochon grillé</option>
      <option>Autre question</option>
    </select>`)}
  ${champ('p-espece', 'Espèce (facultatif)', `<select id="p-espece" name="espece">
      <option value="">Non concerné</option>
      <option>Porc</option><option>Bœuf</option><option>Veau</option><option>Agneau</option><option>Chevreau</option>
    </select>`)}
  ${champ('p-message', 'Message', '<textarea id="p-message" name="message" rows="5" required maxlength="3000"></textarea>')}
  ${piege}
  <button class="btn btn-plein" type="submit">Envoyer ma demande</button>
  ${statut}
  ${rgpd}
</form>`;

const formPro = `<form class="formulaire" action="${E.formspree}" method="POST" novalidate data-type="professionnel">
  <input type="hidden" name="_subject" value="Demande de devis professionnel (site web)">
  <input type="hidden" name="type_demande" value="Professionnel">
  ${champ('e-nom', 'Nom', '<input id="e-nom" name="nom" type="text" autocomplete="name" required maxlength="100">')}
  ${champ('e-exploitation', 'Exploitation ou entreprise', '<input id="e-exploitation" name="exploitation" type="text" autocomplete="organization" required maxlength="150">')}
  ${champ('e-commune', 'Commune de l’exploitation', '<input id="e-commune" name="commune" type="text" autocomplete="address-level2" required maxlength="100">')}
  ${champ('e-tel', 'Téléphone', '<input id="e-tel" name="telephone" type="tel" autocomplete="tel" required pattern="[0-9 +.\\-\\(\\)]{10,20}">')}
  ${champ('e-email', 'Email', '<input id="e-email" name="email" type="email" autocomplete="email" required maxlength="150">')}
  ${champ('e-especes', 'Espèces et volumes (facultatif)', '<input id="e-especes" name="especes_volumes" type="text" maxlength="200" aria-describedby="e-especes-aide">', 'Exemple : 2 bovins par mois, porcs')}
  ${champ('e-message', 'Votre besoin', '<textarea id="e-message" name="message" rows="5" required maxlength="3000"></textarea>')}
  ${piege}
  <button class="btn btn-plein" type="submit">Demander un devis</button>
  ${statut}
  ${rgpd}
</form>`;

export default {
  url,
  title: 'Contact et accès | Boucherie Armoricaine, 23 rue d’Arvor, Lesneven',
  description:
    "Boucherie Armoricaine, 23 rue d'Arvor, 29260 Lesneven, sur le site de l'abattoir. Tél. 02 98 21 08 99. Horaires, plan d'accès et formulaires de demande.",
  h1: 'Contact et accès',
  chapo: 'Le plus simple est de nous appeler. Vous pouvez aussi nous envoyer une demande écrite.',
  ariane: [{ nom: 'Contact', url }],
  schema: [{ '@type': 'ContactPage', url: `https://boucheriearmoricaine.com${url}`, about: { '@id': ENTREPRISE_ID } }],
  body: `
<div class="bloc">
  <div class="conteneur infos-grille">
    <div>
      <h2>Téléphone</h2>
      <p class="tel-grand">${tel(E.telephone)}</p>
      <p><a href="mailto:${E.email}">${esc(E.email)}</a></p>
    </div>
    <div>
      <h2>Adresse</h2>
      ${adresseHtml()}
      <p><a href="${E.googleMaps}" rel="noopener">Itinéraire avec Google Maps</a></p>
    </div>
    <div>
      <h2>Horaires</h2>
      ${horairesHtml()}
    </div>
  </div>
</div>

<div class="bloc bloc-creme">
  <div class="conteneur formulaires">
    <section id="particulier" aria-labelledby="titre-form-part">
      <h2 id="titre-form-part">Vous êtes un particulier</h2>
      <p>Découpe de votre animal, commande de colis, porcelet.</p>
      ${formParticulier}
    </section>
    <section id="professionnel" aria-labelledby="titre-form-pro">
      <h2 id="titre-form-pro">Vous êtes éleveur ou professionnel</h2>
      <p>Abattage et découpe à façon, devis, organisation de vos dates.</p>
      ${formPro}
    </section>
  </div>
</div>

<div class="bloc">
  <div class="conteneur">
    <h2>Plan d'accès</h2>
    <div class="carte">
      <iframe src="https://maps.google.com/maps?q=Boucherie%20Armoricaine%2C%2023%20Rue%20d%27Arvor%2C%2029260%20Lesneven&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Plan d'accès : Boucherie Armoricaine, 23 rue d'Arvor, Lesneven" allowfullscreen></iframe>
    </div>
  </div>
</div>
`,
};
