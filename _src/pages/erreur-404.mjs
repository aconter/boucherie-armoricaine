import { entreprise as E } from '../data/entreprise.mjs';
import { tel } from '../layout.mjs';

export default {
  url: null,
  sortie: '404.html',
  noindex: true,
  title: 'Page introuvable | Boucherie Armoricaine',
  description: "Cette page n'existe pas ou a été déplacée. Retrouvez nos prestations de découpe, nos tarifs et nos coordonnées.",
  h1: 'Cette page est introuvable',
  chapo: "L'adresse est peut-être mal saisie, ou la page a été déplacée.",
  body: `
<div class="bloc">
  <div class="conteneur prose-page">
    <div class="prose">
      <p>Pour joindre directement la boucherie : ${tel(E.telephone)}.</p>
      <ul class="liens-liste">
        <li><a href="/">Page d'accueil</a></li>
        <li><a href="/decoupe-viande-particuliers/">Découpe pour particuliers</a></li>
        <li><a href="/abattage-decoupe-eleveurs/">Découpe à façon pour éleveurs</a></li>
        <li><a href="/colis-de-viande/">Colis de viande</a></li>
        <li><a href="/tarifs/">Tarifs</a></li>
        <li><a href="/contact/">Contact et accès</a></li>
      </ul>
    </div>
  </div>
</div>
`,
};
