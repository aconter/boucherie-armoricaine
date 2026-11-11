import tarifs from '../data/tarifs.json' with { type: 'json' };
import { appel, grilleTarifs } from '../layout.mjs';

const url = '/tarifs/';

export default {
  url,
  title: 'Tarifs abattage, découpe et colis de viande | Boucherie Armoricaine Lesneven',
  description:
    'Tarifs 2026 de la Boucherie Armoricaine à Lesneven : abattage et découpe à façon (HT), PAD, semi-paré, saucisserie, et colis de viande au détail (TTC).',
  h1: 'Nos tarifs',
  chapo: 'Prestations de découpe en HT pour les professionnels, colis de viande en TTC pour les particuliers.',
  ariane: [{ nom: 'Tarifs', url }],
  body: `
<div class="bloc">
  <div class="conteneur">
    <nav class="sommaire" aria-label="Sur cette page">
      <ul>
        <li><a href="#professionnels">Abattage et découpe (HT)</a></li>
        <li><a href="#particuliers">Colis de viande (TTC)</a></li>
      </ul>
    </nav>
    <section id="professionnels" aria-labelledby="titre-pro">
      <h2 id="titre-pro">Abattage et découpe à façon (prix HT)</h2>
      <p class="intro">Prestations réalisées sur votre animal. Le prix dépend de l'espèce, du poids de la carcasse et des préparations choisies. <a href="/abattage-decoupe-eleveurs/">Voir le déroulement</a>.</p>
      ${grilleTarifs(tarifs.professionnels)}
    </section>
  </div>
</div>
<div class="bloc bloc-creme">
  <div class="conteneur">
    <section id="particuliers" aria-labelledby="titre-part">
      <h2 id="titre-part">Colis de viande au détail (prix TTC)</h2>
      <p class="intro">${tarifs.particuliers.conditions} Mise sous vide et congélation offertes. <a href="/colis-de-viande/">Comment commander</a>.</p>
      ${grilleTarifs(tarifs.particuliers)}
    </section>
  </div>
</div>
${appel({ titre: 'Un devis pour votre animal ? Appelez-nous.' })}
`,
};
