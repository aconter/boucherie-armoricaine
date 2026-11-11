import tarifs from '../data/tarifs.json' with { type: 'json' };
import { entreprise as E } from '../data/entreprise.mjs';
import { tel, appel, schemaService, grilleTarifs } from '../layout.mjs';

const url = '/decoupe-cochon/';
const pro = tarifs.professionnels;
const porcPro = pro.grilles.find((g) => g.id === 'abattage-decoupe').lignes.filter((l) => /Porc/.test(l.libelle));
const saucissePro = pro.grilles.find((g) => g.id === 'supplements').lignes.find((l) => /Saucisse/.test(l.libelle));

export default {
  url,
  title: 'Faire découper son cochon à Lesneven (29) | Boucherie Armoricaine',
  description:
    "Abattage et découpe de votre cochon ou demi-porc à Lesneven : rôtis, côtes, saucisses, sous vide. Porcelet saumuré pour cochon grillé. Nord Finistère.",
  h1: 'Faire abattre et découper son cochon',
  chapo: "Cochon entier, demi-porc ou porcelet pour cochon grillé : découpe sur mesure sur le site de l'abattoir de Lesneven.",
  ariane: [
    { nom: 'Particuliers', url: '/decoupe-viande-particuliers/' },
    { nom: 'Découpe de porc', url },
  ],
  schema: [
    schemaService({
      nom: 'Abattage et découpe de porc',
      type: 'Découpe de porc à façon',
      url,
      description: 'Abattage et découpe de cochon et de demi-porc, saucisserie, mise sous vide et porcelet saumuré, à Lesneven.',
    }),
  ],
  body: `
<div class="bloc">
  <div class="conteneur prose-page">
    <div class="prose">
      <h2>Votre cochon découpé comme vous le souhaitez</h2>
      <p>Vous avez élevé un cochon ? Appelez-nous au ${tel(E.telephone)} pour convenir d'une date, puis amenez-le au 23 rue d'Arvor à Lesneven, sur le site de l'abattoir. Il y est abattu et découpé, sans transport de carcasse.</p>
      <p>Vous choisissez les morceaux et le conditionnement : rôtis, côtes, échine, poitrine, sauté, jarret, haché, saucisses. La viande peut être mise sous vide et congelée. Nous vous tenons informé du rendement de votre bête.</p>

      <h2>Pour le kig ha farz</h2>
      <p>Pensez à garder le jarret et la poitrine de porc : nous les préparons à votre convenance.</p>

      <h2>Saucisses, chipolatas et merguez</h2>
      <p>Une partie de votre cochon peut être transformée en saucisses, chipolatas ou merguez. Indiquez-le au moment de la commande.</p>

      <h2>Tarifs de la prestation</h2>
      <p>Pour information, voici la grille de prestation appliquée à l'abattage et à la découpe du porc (prix HT). Appelez-nous pour un devis adapté à votre animal.</p>
      <div class="ardoises ardoises-une">
        <section class="ardoise" aria-labelledby="t-porc-pro">
          <h3 id="t-porc-pro">Porc : abattage et découpe</h3>
          <p class="ardoise-unite">Prix HT</p>
          <table>
            <thead class="visually-hidden"><tr><th scope="col">Prestation</th><th scope="col">Prix HT</th></tr></thead>
            <tbody>
              ${[...porcPro, saucissePro].map((l) => `<tr><th scope="row">${l.libelle}</th><td>${l.prix.replace(/(\d) €/g, '$1&nbsp;€')}</td></tr>`).join('')}
            </tbody>
          </table>
        </section>
      </div>
      <p class="maj">Prix HT. Mise à jour : ${pro.mise_a_jour}. <a href="/tarifs/">Tous les tarifs</a>.</p>

      <h2 id="porcelet">Porcelet saumuré pour cochon grillé</h2>
      <p>Pour une fête ou un repas de famille, nous vendons du porcelet saumuré à partir de 20 kg. Comptez environ 500 g par personne pour un cochon grillé.</p>
      ${grilleTarifs(tarifs.particuliers, { ids: ['porcelet'] })}
      <p>Vous avez votre propre porcelet ? Nous pouvons l'abattre et le saumurer (voir la ligne « Porcelet » de la grille ci-dessus).</p>

      <h2>Pas de cochon ? Achetez au détail</h2>
      <p>Échine, côte, poitrine, rôti, sauté, jarret et saucisserie sont vendus au détail à partir de 1 kg, sous vide et congelés gratuitement. <a href="/colis-de-viande/">Voir les colis de viande</a>.</p>
    </div>
  </div>
</div>
${appel({ titre: 'Un cochon à faire découper ? Appelez-nous.' })}
`,
};
