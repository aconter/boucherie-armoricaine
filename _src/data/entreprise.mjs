// Informations de l'entreprise : source unique pour tout le site.
// Ne modifier qu'avec la validation du responsable.
export const entreprise = {
  nom: 'Boucherie Armoricaine',
  raisonSociale: 'SARL Kig Armor',
  url: 'https://boucheriearmoricaine.com',
  telephone: '02 98 21 08 99',
  telephoneIntl: '+33298210899',
  email: 'contact@boucheriearmoricaine.com',
  adresse: {
    rue: "23 rue d'Arvor",
    complement: "Site de l'abattoir de Lesneven",
    codePostal: '29260',
    ville: 'Lesneven',
    region: 'Bretagne',
    pays: 'FR',
  },
  geo: { lat: 48.57755, lng: -4.31892 },
  googleMaps: 'https://www.google.com/maps/place/?q=place_id:ChIJ17tOglyrFkgRTt2lDkUPt40',
  horaires: [
    { jours: 'Du lundi au vendredi', texte: '9h à 17h', schemaJours: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], ouvre: '09:00', ferme: '17:00' },
    { jours: 'Le samedi', texte: '9h à 12h', schemaJours: ['Saturday'], ouvre: '09:00', ferme: '12:00' },
    { jours: 'Le dimanche', texte: 'fermé' },
  ],
  paiement: 'Espèces, carte bancaire',
  especes: ['bœuf', 'veau', 'porc', 'agneau', 'chevreau'],
  formspree: 'https://formspree.io/f/xjggrpbg',
  trustindexWidget: '24459b575f114566dd66eea56a6',
};

export const navigation = [
  { href: '/decoupe-viande-particuliers/', label: 'Particuliers' },
  { href: '/abattage-decoupe-eleveurs/', label: 'Éleveurs et pros' },
  { href: '/colis-de-viande/', label: 'Colis' },
  { href: '/tarifs/', label: 'Tarifs' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
];
