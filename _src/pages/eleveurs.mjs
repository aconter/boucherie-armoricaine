import tarifs from '../data/tarifs.json' with { type: 'json' };
import { entreprise as E } from '../data/entreprise.mjs';
import { tel, appel, schemaService, grilleTarifs } from '../layout.mjs';

const url = '/abattage-decoupe-eleveurs/';

export default {
  url,
  title: 'Abattage et découpe à façon pour éleveurs | Boucherie Armoricaine Lesneven',
  description:
    'Abattage et découpe à façon pour la vente directe à Lesneven (29) : bœuf, veau, porc, agneau. Sous vide, saucisserie, cartons, PAD. Tarifs HT en ligne.',
  h1: 'Abattage et découpe à façon pour éleveurs',
  chapo: "Découpe, saucisserie, sous vide et cartons pour votre vente directe, sur le site de l'abattoir de Lesneven.",
  ariane: [{ nom: 'Éleveurs et professionnels', url }],
  schema: [
    schemaService({
      nom: 'Abattage et découpe à façon pour éleveurs',
      type: 'Découpe de viande à façon pour la vente directe',
      url,
      description:
        "Abattage, découpe selon fiches de découpe, saucisserie, mise sous vide, cartons, PAD et semi-paré pour éleveurs en vente directe, à Lesneven.",
    }),
  ],
  body: `
<div class="bloc">
  <div class="conteneur prose-page">
    <div class="prose">
      <h2>Une prestation à façon pour la vente directe</h2>
      <p>Vous vendez votre viande en direct, à la ferme ou en colis ? La Boucherie Armoricaine abat et découpe vos animaux sur le site de l'abattoir de Lesneven, puis vous rend une viande prête à vendre : découpée, conditionnée sous vide et mise en cartons.</p>
      <p>Bovins, veaux, porcs, porcelets, ovins et caprins. Découpe en frais ou sous vide, selon vos fiches de découpe.</p>

      <h2>Déroulement</h2>
      <ol class="etapes">
        <li><strong>Vous nous contactez</strong> au ${tel(E.telephone)} pour organiser vos dates d'abattage.</li>
        <li><strong>Vous nous transmettez vos consignes</strong> : fiches de découpe, préparations souhaitées (haché, saucisserie), conditionnement.</li>
        <li><strong>Nous abattons et découpons</strong> sur le site de l'abattoir de Lesneven, sans transport de carcasse.</li>
        <li><strong>Vous récupérez une viande prête à vendre</strong>, sous vide et en cartons si vous le souhaitez.</li>
      </ol>

      <h2>PAD ou semi-paré : que choisir ?</h2>
      <p>Le <strong>PAD</strong> (prêt à découper) est une viande dégraissée et dénervée, prête à être portionnée. Le <strong>semi-paré</strong> est désossé, non dénervé, avec un dégraissage sommaire : c'est la solution la plus économique si vous terminez le travail vous-même. Les deux formules s'appliquent uniquement à la bête entière ou à la demi-bête.</p>
    </div>
  </div>
</div>

<div class="bloc bloc-creme" id="tarifs">
  <div class="conteneur">
    <h2>Tarifs professionnels (HT)</h2>
    ${grilleTarifs(tarifs.professionnels)}
  </div>
</div>

<div class="bloc">
  <div class="conteneur prose-page">
    <div class="prose">
      <h2>Éleveurs du Nord Finistère</h2>
      <p>Nous travaillons avec des éleveurs du Léon, du Pays des Abers, de la Côte des Légendes et du pays de Landerneau-Daoulas. Contactez-nous pour organiser vos dates d'abattage et nous transmettre vos consignes de découpe.</p>
      <p>Éleveurs ailleurs dans le Finistère, dans les Côtes-d'Armor ou le Morbihan : <a href="/zone-intervention/bretagne-eleveurs/">temps de route et conditions</a>.</p>
      <p><a class="btn btn-plein" href="/contact/#professionnel">Demander un devis professionnel</a></p>
    </div>
  </div>
</div>
${appel({ titre: 'Organiser vos dates d’abattage' })}
`,
};
