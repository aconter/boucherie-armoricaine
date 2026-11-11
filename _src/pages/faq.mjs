import { appel, esc } from '../layout.mjs';

const url = '/faq/';

// Chaque réponse est affichée telle quelle sur la page ET dans le balisage FAQPage.
// `html` (facultatif) enrichit l'affichage de liens ; `texte` sert au balisage.
const questions = [
  { q: 'Où se trouve la Boucherie Armoricaine ?', texte: "Au 23 rue d'Arvor, 29260 Lesneven, sur le site de l'abattoir de Lesneven, dans le Nord Finistère.", html: `Au 23 rue d'Arvor, 29260 Lesneven, sur le site de l'abattoir de Lesneven, dans le Nord Finistère. <a href="/contact/">Plan et accès</a>.` },
  { q: 'Quels sont vos horaires ?', texte: 'Du lundi au vendredi de 9h à 17h, et le samedi de 9h à 12h. Fermé le dimanche.' },
  { q: 'Quelles viandes travaillez-vous ?', texte: "Le bœuf, le veau, le porc, l'agneau et le chevreau." },
  { q: 'Comment faire découper mon cochon ou mon agneau ?', texte: "Appelez-nous au 02 98 21 08 99 pour convenir d'une date. Vous amenez l'animal sur place, nous l'abattons et le découpons selon vos consignes, puis vous récupérez vos colis.", html: `Appelez-nous au <a href="tel:+33298210899">02 98 21 08 99</a> pour convenir d'une date. Vous amenez l'animal sur place, nous l'abattons et le découpons selon vos consignes, puis vous récupérez vos colis. <a href="/decoupe-viande-particuliers/">Le déroulement en détail</a>.` },
  { q: 'Puis-je faire des saucisses avec mon propre animal ?', texte: 'Oui. Une partie de la viande peut être transformée en saucisses, chipolatas ou merguez, ou hachée. Indiquez-le au moment de la commande.' },
  { q: 'Combien de viande vais-je récupérer ?', texte: "Le poids de viande dépend de l'animal et de la découpe choisie. Nous vous tenons informé du rendement de votre bête." },
  { q: 'Puis-je acheter de la viande sans avoir d’animal ?', texte: "Oui. Nous vendons des colis de bœuf, de porc et de saucisserie au détail, à partir de 1 kg. D'autres morceaux sont possibles sur demande selon les volumes.", html: `Oui. Nous vendons des colis de bœuf, de porc et de saucisserie au détail, à partir de 1 kg. D'autres morceaux sont possibles sur demande selon les volumes. <a href="/colis-de-viande/">Voir les colis et les prix</a>.` },
  { q: 'La mise sous vide est-elle payante ?', texte: 'Pour les colis particuliers, la mise sous vide et la congélation sont offertes. Pour les prestations aux éleveurs, le sac sous vide est facturé 0,50 € HT pièce.' },
  { q: 'Faites-vous du porcelet pour cochon grillé ?', texte: 'Oui, le porcelet saumuré à partir de 20 kg, à 11 € TTC le kilo. Comptez environ 500 g par personne pour un cochon grillé.', html: `Oui, le porcelet saumuré à partir de 20 kg, à 11 € TTC le kilo. Comptez environ 500 g par personne pour un cochon grillé. <a href="/decoupe-cochon/#porcelet">En savoir plus</a>.` },
  { q: 'Quelle est la différence entre PAD et semi-paré ?', texte: 'Le PAD (prêt à découper) est dégraissé et dénervé. Le semi-paré est désossé, non dénervé, avec un dégraissage sommaire. Ces deux formules concernent la bête entière ou la demi-bête.' },
  { q: 'Pourquoi certains prix sont en HT et d’autres en TTC ?', texte: "Les prestations d'abattage et de découpe sont affichées en HT, comme pour les professionnels. Les colis de viande vendus au détail sont affichés en TTC.", html: `Les prestations d'abattage et de découpe sont affichées en HT, comme pour les professionnels. Les colis de viande vendus au détail sont affichés en TTC. <a href="/tarifs/">Voir tous les tarifs</a>.` },
  { q: 'Quels moyens de paiement acceptez-vous ?', texte: 'Les espèces et la carte bancaire.' },
];

export default {
  url,
  title: 'Questions fréquentes | Boucherie Armoricaine Lesneven',
  description:
    'Horaires, découpe de votre cochon ou agneau, colis dès 1 kg, porcelet pour cochon grillé, sous vide, PAD : les réponses de la Boucherie Armoricaine à Lesneven.',
  h1: 'Questions fréquentes',
  chapo: "Tout ce qu'il faut savoir avant de nous confier votre animal ou de commander un colis.",
  ariane: [{ nom: 'FAQ', url }],
  schema: [
    {
      '@type': 'FAQPage',
      mainEntity: questions.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.texte } })),
    },
  ],
  body: `
<div class="bloc">
  <div class="conteneur prose-page">
    <div class="faq">
      ${questions.map((x) => `<details><summary>${esc(x.q)}</summary><p>${x.html ?? esc(x.texte)}</p></details>`).join('\n      ')}
    </div>
  </div>
</div>
${appel({ titre: 'Une autre question ? Appelez-nous.' })}
`,
};
