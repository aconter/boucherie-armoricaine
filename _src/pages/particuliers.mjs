import { entreprise as E } from '../data/entreprise.mjs';
import { tel, appel, schemaService } from '../layout.mjs';

const url = '/decoupe-viande-particuliers/';

export default {
  url,
  title: 'Découpe de viande pour particuliers à Lesneven (29) | Boucherie Armoricaine',
  description:
    "Faites abattre et découper votre cochon, agneau, veau ou bœuf à Lesneven, sur le site de l'abattoir. Découpe sur mesure, sous vide, saucisses. Finistère.",
  h1: 'Découpe de viande pour particuliers',
  chapo: "Votre cochon, agneau, veau ou bœuf abattu et découpé selon vos souhaits, sur le site de l'abattoir de Lesneven.",
  ariane: [{ nom: 'Particuliers', url }],
  schema: [
    schemaService({
      nom: 'Abattage et découpe de viande pour particuliers',
      type: 'Abattage et découpe à façon',
      url,
      description: "Abattage et découpe sur mesure du porc, du bœuf, du veau, de l'agneau et du chevreau des particuliers, à Lesneven.",
    }),
  ],
  body: `
<div class="bloc">
  <div class="conteneur prose-page">
    <div class="prose">
      <h2>Faire découper son cochon, son agneau ou son bœuf</h2>
      <p>Vous avez élevé un animal pour votre consommation ? La Boucherie Armoricaine s'occupe de tout, de l'abattage à la mise en colis. L'atelier se trouve sur le site de l'abattoir de Lesneven : l'animal est abattu et découpé au même endroit.</p>
      <p>Nous travaillons le <strong>porc</strong>, le <strong>bœuf</strong>, le <strong>veau</strong>, l'<strong>agneau</strong> et le <strong>chevreau</strong>, en bête entière ou en demi-bête.</p>

      <h2>Comment ça se passe</h2>
      <ol class="etapes">
        <li><strong>Vous nous appelez</strong> au ${tel(E.telephone)} pour convenir d'une date et nous parler de votre animal.</li>
        <li><strong>Vous amenez l'animal</strong> au 23 rue d'Arvor à Lesneven, sur le site de l'abattoir.</li>
        <li><strong>Nous découpons selon vos souhaits</strong> : rôtis, côtes, steaks, sauté, haché, saucisses. Vous choisissez les morceaux et le conditionnement.</li>
        <li><strong>Vous récupérez vos colis</strong>, en frais ou congelés, prêts à ranger au congélateur. Nous vous tenons informé du rendement de votre bête.</li>
      </ol>

      <h2>Par espèce</h2>
      <h3>Porc et porcelet</h3>
      <p>Cochon entier ou demi-porc, découpe en rôtis, côtes, échine, poitrine, sauté, haché et saucisserie. Pour le kig ha farz, pensez à garder le jarret et la poitrine. Nous préparons aussi le porcelet saumuré pour le cochon grillé. <a href="/decoupe-cochon/">Tout sur la découpe du porc</a>.</p>
      <h3>Bœuf et veau</h3>
      <p>Bête entière ou demi-bête, découpée selon vos consignes : steaks, rôtis, bourguignon, haché. Mise sous vide pour une meilleure conservation.</p>
      <h3>Agneau et chevreau</h3>
      <p>Découpe selon vos souhaits, en frais ou sous vide.</p>

      <h2>Nos préparations</h2>
      <ul class="liste-coches">
        <li>Découpe fraîche selon vos consignes</li>
        <li>Mise sous vide pour une meilleure conservation</li>
        <li>Hachage</li>
        <li>Saucisses, chipolatas et merguez</li>
        <li>Congélation</li>
        <li>Porcelet saumuré pour le cochon grillé</li>
      </ul>

      <h2>Tarifs</h2>
      <p>Le prix dépend de l'espèce, du poids de la carcasse et des préparations choisies. Le détail des tarifs de prestation (abattage, découpe, saucisserie, sous vide) est affiché sur la page <a href="/tarifs/#professionnels">tarifs</a>. Appelez-nous pour un devis adapté à votre animal.</p>
      <p>Vous n'avez pas d'animal ? Vous pouvez aussi <a href="/colis-de-viande/">commander nos colis de viande</a> à partir de 1 kg, avec mise sous vide et congélation offertes.</p>

      <h2>D'où viennent nos clients</h2>
      <p>Nous accueillons des particuliers de tout le Nord Finistère : Lesneven et Le Folgoët, la Côte des Légendes, le Pays des Abers, Plabennec, Ploudaniel, Landerneau, Landivisiau, Plouescat, Saint-Renan et la région de Brest. <a href="/zone-intervention/">Voir la zone d'intervention</a>.</p>

      <h2>Questions fréquentes</h2>
      <p>Commande minimum, porcelet pour cochon grillé, mise sous vide : consultez notre <a href="/faq/">foire aux questions</a>.</p>
    </div>
  </div>
</div>
${appel()}
`,
};
