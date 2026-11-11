import tarifs from '../data/tarifs.json' with { type: 'json' };
import { entreprise as E } from '../data/entreprise.mjs';
import { tel, appel, grilleTarifs, ENTREPRISE_ID } from '../layout.mjs';

const url = '/colis-de-viande/';
const p = tarifs.particuliers;

export default {
  url,
  title: 'Colis de viande à Lesneven : bœuf, porc, saucisserie | Boucherie Armoricaine',
  description:
    'Colis de bœuf, de porc et de saucisserie au détail dès 1 kg à Lesneven (29). Prix TTC au kilo en ligne, mise sous vide et congélation offertes.',
  h1: 'Colis de viande au détail',
  chapo: 'Bœuf, porc et saucisserie à partir de 1 kg, mis sous vide et congelés gratuitement.',
  ariane: [{ nom: 'Colis de viande', url }],
  schema: [
    {
      '@type': 'OfferCatalog',
      name: 'Colis de viande : les incontournables',
      url: `https://boucheriearmoricaine.com${url}`,
      provider: { '@id': ENTREPRISE_ID },
    },
  ],
  body: `
<div class="bloc">
  <div class="conteneur">
    <div class="prose">
      <h2>Les incontournables</h2>
      <p>${p.conditions}</p>
    </div>
    ${grilleTarifs(p, { ids: ['boeuf', 'porc', 'saucisserie'] })}
    <ul class="offerts" aria-label="Prestations offertes sur les colis">
      ${p.offerts.map((o) => `<li><strong>${o}</strong> offerte</li>`).join('')}
    </ul>
  </div>
</div>

<div class="bloc bloc-creme">
  <div class="conteneur deux-colonnes">
    <div class="prose">
      <h2>Comment commander</h2>
      <ol class="etapes">
        <li><strong>Appelez-nous</strong> au ${tel(E.telephone)} ou <a href="/contact/#particulier">envoyez une demande</a> en précisant les morceaux et les quantités souhaités.</li>
        <li><strong>Nous préparons votre commande</strong>, mise sous vide et congelée si vous le souhaitez, sans supplément.</li>
        <li><strong>Nous convenons ensemble</strong> de la date et des modalités de mise à disposition.</li>
      </ol>
      <p>Paiement en espèces ou par carte bancaire.</p>
    </div>
    <div class="prose">
      <h2 id="porcelet">Porcelet saumuré</h2>
      ${grilleTarifs(p, { ids: ['porcelet'] })}
      <p><a href="/decoupe-cochon/#porcelet">Organiser un cochon grillé</a></p>
    </div>
  </div>
</div>
${appel({ titre: 'Commander un colis de viande', texte: `Appelez-nous du lundi au vendredi de 9h à 17h, le samedi de 9h à 12h.` })}
`,
};
