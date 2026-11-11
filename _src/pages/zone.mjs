import { entreprise as E } from '../data/entreprise.mjs';
import { tel, appel } from '../layout.mjs';

const url = '/zone-intervention/';

// Regroupement par bassin de vie. Aucune présence physique hors de Lesneven :
// toutes les prestations ont lieu à l'atelier, 23 rue d'Arvor.
const bassins = [
  {
    nom: 'Pays de Lesneven et Côte des Légendes',
    communes: ['Lesneven', 'Le Folgoët', 'Ploudaniel', 'Kernilis', 'Kerlouan', 'Guissény', 'Plounéour-Brignogan-Plages', 'Goulven'],
    texte: "C'est notre commune d'implantation et ses voisines immédiates : l'atelier est à Lesneven même, sur le site de l'abattoir.",
  },
  {
    nom: 'Pays des Abers',
    communes: ['Plouguerneau', 'Lannilis', 'Landéda', 'Plabennec', 'Le Drennec'],
    texte: "Les particuliers et éleveurs des Abers viennent à Lesneven pour faire abattre et découper leurs animaux.",
  },
  {
    nom: 'Brest et pays d’Iroise',
    communes: ['Brest', 'Guipavas', 'Saint-Renan', 'Ploudalmézeau'],
    texte: 'Nous accueillons aussi des clients de la métropole brestoise et du pays d’Iroise.',
  },
  {
    nom: 'Pays de Landerneau-Daoulas et de Landivisiau',
    communes: ['Landerneau', 'Landivisiau'],
    texte: 'Particuliers et éleveurs du pays de Landerneau-Daoulas et du pays de Landivisiau font partie de nos clients.',
  },
  {
    nom: 'Haut-Léon',
    communes: ['Plouescat', 'Plounévez-Lochrist'],
    texte: 'Côté Haut-Léon, nos clients viennent notamment de Plouescat et de Plounévez-Lochrist.',
  },
];

export default {
  url,
  title: "Découpe de viande dans le Nord Finistère | Boucherie Armoricaine",
  description:
    "Particuliers et éleveurs du Nord Finistère : Côte des Légendes, Abers, Brest, Landerneau, Landivisiau. Abattage et découpe à notre atelier de Lesneven.",
  h1: "D'où viennent nos clients",
  chapo: "Une seule adresse, l'atelier du 23 rue d'Arvor à Lesneven, pour les particuliers et les éleveurs du Nord Finistère.",
  ariane: [{ nom: "Zone d'intervention", url }],
  body: `
<div class="bloc">
  <div class="conteneur prose-page">
    <div class="prose">
      <h2>Tout se passe à Lesneven</h2>
      <p>Nous n'avons qu'un seul site : l'atelier de découpe installé sur le site de l'abattoir de Lesneven. Vous y amenez votre animal, il y est abattu et découpé, et vous y récupérez vos colis.</p>
      <p>Avant de venir, appelez-nous au ${tel(E.telephone)} pour convenir d'une date.</p>
    </div>
  </div>
</div>

<div class="bloc bloc-creme" id="particuliers">
  <div class="conteneur">
    <h2>Particuliers du Nord Finistère</h2>
    <div class="bassins">
      ${bassins
        .map(
          (b) => `<section class="bassin">
        <h3>${b.nom}</h3>
        <p>${b.texte}</p>
        <p class="communes">${b.communes.join(', ')}</p>
      </section>`,
        )
        .join('')}
    </div>
    <p class="intro">Votre commune n'est pas citée ? Appelez-nous pour en parler.</p>
    <ul class="liens-liste">
      <li><a href="/decoupe-viande-particuliers/">Faire découper votre animal</a></li>
      <li><a href="/decoupe-cochon/">Découpe de porc et porcelet</a></li>
      <li><a href="/colis-de-viande/">Colis de viande</a></li>
    </ul>
  </div>
</div>

<div class="bloc" id="eleveurs">
  <div class="conteneur prose-page">
    <div class="prose">
      <h2>Éleveurs et professionnels</h2>
      <p>Nous travaillons avec des éleveurs du Léon, du Pays des Abers, de la Côte des Légendes et du pays de Landerneau-Daoulas, pour l'abattage et la découpe à façon de leurs animaux destinés à la vente directe.</p>
      <p>Vous êtes éleveur ailleurs en Bretagne ? Contactez-nous pour vérifier ensemble les possibilités.</p>
      <p><a class="btn btn-plein" href="/contact/#professionnel">Demander un devis professionnel</a> <a href="/abattage-decoupe-eleveurs/">Voir la prestation et les tarifs HT</a></p>
    </div>
  </div>
</div>
${appel()}
`,
};
