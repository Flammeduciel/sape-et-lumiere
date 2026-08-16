const FESTIVAL = {
  name: "Sape & Lumière",
  tagline: "ÉLÉGANCE · CULTURE · LUMIÈRE",

  dates: {
    opening: "2026-09-18T18:00:00",
    startedLabel: "LE FESTIVAL A COMMENCÉ !",
    label: "DU 18 AU 20 SEPTEMBRE 2026",
    days: [
      { label: "VENDREDI 18 SEPTEMBRE", value: "vendredi", image: "https://picsum.photos/seed/festival-vendredi/800/600" },
      { label: "SAMEDI 19 SEPTEMBRE", value: "samedi", image: "https://picsum.photos/seed/festival-samedi/800/600" },
      { label: "DIMANCHE 20 SEPTEMBRE", value: "dimanche", image: "https://picsum.photos/seed/festival-dimanche/800/600" }
    ]
  },

  hero: {
    title: "FESTIVAL SAPE & LUMIÈRE",
    description: "3 JOURS DE CULTURE, D'ÉLÉGANCE ET DE LUMIÈRE À BRAZZAVILLE",
    cta1: "DÉCOUVRIR LE PROGRAMME",
    cta2: "RÉSERVER SUR WHATSAPP"
  },

  programme: {
    vendredi: [
      { time: "18:00-19:00", title: "Ouverture des portes", icon: "door_open", desc: "Accueil et enregistrement des participants" },
      { time: "19:00-20:30", title: "Défilé de mode – Sape & Créateurs", icon: "checkroom", desc: "Créateurs congolais et sapeurs sur le podium" },
      { time: "20:30-22:00", title: "Concert Live", icon: "music_note", desc: "Performance live sur la scène principale" },
      { time: "22:00-23:30", title: "Art Lumière – Installation", icon: "lightbulb", desc: "Parcours immersif de lumière et d'art" },
      { time: "23:30-01:00", title: "DJ Set & Ambiance", icon: "graphic_eq", desc: "Soirée danse avec les meilleurs DJs" }
    ],
    samedi: [
      { time: "14:00-15:30", title: "Atelier Sape & Style", icon: "palette", desc: "Apprenez l'art de la sape avec les maîtres" },
      { time: "15:30-17:00", title: "Duel Musical", icon: "sports_martial_arts", desc: "Affrontement musical entre artistes" },
      { time: "17:00-18:30", title: "Défilé de Créateurs", icon: "checkroom", desc: "Nouvelles collections et tendances" },
      { time: "18:30-20:00", title: "Concert Principal", icon: "star", desc: "Tête d'affiche de la soirée" },
      { time: "20:00-22:00", title: "Nuit Lumière", icon: "nightlight", desc: "Spectacle luminaire géant" }
    ],
    dimanche: [
      { time: "15:00-16:30", title: "Brunch Élégance", icon: "restaurant", desc: "Repas raffiné en bonne compagnie" },
      { time: "16:30-18:00", title: "Performance Art", icon: "theater_comedy", desc: "Arts de la scène et performances live" },
      { time: "18:00-19:30", title: "Concert de Clôture", icon: "celebration", desc: "La grande finale musicale" },
      { time: "19:30-21:00", title: "Spectacle Lumière Finale", icon: "auto_awesome", desc: "Clôture magique avec feux d'artifice" }
    ]
  },

  categories: [
    { label: "TOUS", value: "tous" },
    { label: "MUSIQUE", value: "musique" },
    { label: "MODE & SAPE", value: "mode" },
    { label: "ART LUMIÈRE", value: "art" }
  ],

  artists: [
    { name: "Kévin Mavungu", discipline: "Chant, Afrobeat", category: "musique", image: "https://picsum.photos/seed/kevin-mavungu/400/400", bio: "Figure montante de l'afrobeat congolais, Kévin Mavungu mêle rythmes traditionnels et sonorités urbaines. Ses textes en lingala et français racontent la jeunesse de Brazzaville.", social: { instagram: "#", youtube: "#", spotify: "#" } },
    { name: "Maya Nsimba", discipline: "Chant, Soul & R&B", category: "musique", image: "https://picsum.photos/seed/maya-nsimba/400/400", bio: "Voix veloutée de la scène soul brazzavilloise, Maya Nsimba revisite les standards avec une touche afro-futuriste. Son premier EP 'Éclats' a marqué 2024.", social: { instagram: "#", youtube: "#", spotify: "#" } },
    { name: "Darel Kossa", discipline: "DJ, Afro-house", category: "musique", image: "https://picsum.photos/seed/darel-kossa/400/400", bio: "Maître des dancefloors de la capitale, Darel Kossa fusionne afro-house, amapiano et ndombolo. Ses sets sont des voyages rythmiques sans frontière.", social: { instagram: "#", soundcloud: "#", mixcloud: "#" } },
    { name: "Léna Mpassi", discipline: "Stylisme, Haute couture", category: "mode", image: "https://picsum.photos/seed/lena-mpassi/400/400", bio: "Créatrice de la maison 'Mpassi Atelier', Léna habille l'élite sapeuse avec des pièces uniques alliant tissus traditionnels (liputa, ngwala) et coupes contemporaines.", social: { instagram: "#", website: "#" } },
    { name: "Chris Banzouzi", discipline: "Stylisme, Sape", category: "mode", image: "https://picsum.photos/seed/chris-banzouzi/400/400", bio: "Ambassadeur de la sape moderne, Chris Banzouzi signe des tenues où le tailoring italien rencontre l'audace congolaise. Ses costumes racontent l'histoire d'un peuple élégant.", social: { instagram: "#", website: "#" } },
    { name: "Noah Makosso", discipline: "Design vestimentaire", category: "mode", image: "https://picsum.photos/seed/noah-makosso/400/400", bio: "Designer pluridisciplinaire, Noah Makosso explore les matières recyclées et le upcycling textile. Ses collections 'Renaissance' transforment les chutes en œuvres portables.", social: { instagram: "#", behance: "#" } },
    { name: "Élodie Ngalula", discipline: "Installation lumineuse", category: "art", image: "https://picsum.photos/seed/elodie-ngalula/400/400", bio: "Artiste lumière formée à l'École des Beaux-Arts de Kinshasa, Élodie crée des environnements immersifs où la lumière sculpte l'espace. Son travail questionne la perception.", social: { instagram: "#", website: "#" } },
    { name: "Marc Elonga", discipline: "Art numérique", category: "art", image: "https://picsum.photos/seed/marc-elonga/400/400", bio: "Pionnier du digital art en Afrique centrale, Marc Elonga code des génératifs visuels projetés sur l'architecture urbaine. Ses algorithmes dansent au rythme du ndombolo.", social: { instagram: "#", github: "#", website: "#" } },
    { name: "Sarah Mouzinga", discipline: "Sculpture lumineuse", category: "art", image: "https://picsum.photos/seed/sarah-mouzinga/400/400", bio: "Sculptrice de lumière, Sarah Mouzinga travaille le néon, la fibre optique et le verre. Ses installations 'Âmes brillantes' illuminent les nuits de Brazzaville depuis 2022.", social: { instagram: "#", website: "#" } }
  ],

  billetterie: {
    whatsappNumber: "242060000000",
    info: "Paiement et réservation uniquement via WhatsApp.",
    tickets: [
      {
        id: "pass-1jour",
        name: "PASS 1 JOUR",
        price: "5 000 FCFA",
        details: "Accès à toutes les activités du jour sélectionné.",
        popular: false
      },
      {
        id: "pass-3jours",
        name: "PASS 3 JOURS",
        price: "12 000 FCFA",
        details: "Accès aux 3 jours de festival, toutes les activités.",
        popular: true
      }
    ],
    features: [
      "Accès à toutes les activités",
      "Ambiance exceptionnelle",
      "Sécurité garantie",
      "Expérience inoubliable"
    ],
    whatsappMessage: (passName) => `Bonjour, je souhaite réserver un ${passName} pour le Festival Sape & Lumière. Merci !`
  },

  pratique: {
    title: "INFORMATIONS PRATIQUES",
    subtitle: "Préparez votre venue au festival",
    items: [
      { icon: "location_on", label: "Lieu", text: "Esplanade du Palais des Congrès, Brazzaville" },
      { icon: "schedule", label: "Horaires", text: "Ouverture des portes dès 18h00, du vendredi au dimanche" },
      { icon: "directions_bus", label: "Accès", text: "À 10 minutes du centre-ville, lignes de bus 2, 5 et 12" },
      { icon: "local_parking", label: "Parking", text: "Parking sécurisé et gratuit près de l'entrée" },
      { icon: "restaurant", label: "Restauration", text: "Stands de restauration locale et internationale sur place" },
      { icon: "confirmation_number", label: "Réservation", text: "Pass uniquement via WhatsApp : 06 000 00 00" }
    ]
  },

  partenaires: [
    { name: "Akieni Academy", image: "https://picsum.photos/seed/akieni-academy/400/200" },
    { name: "TotalEnergies Congo", image: "https://picsum.photos/seed/total-congo/400/200" },
    { name: "Airtel Congo", image: "https://picsum.photos/seed/airtel-congo/400/200" },
    { name: "MTN Congo", image: "https://picsum.photos/seed/mtn-congo/400/200" },
    { name: "Canal+", image: "https://picsum.photos/seed/canal-plus/400/200" },
    { name: "Palais des Congrès", image: "https://picsum.photos/seed/palais-congres/400/200" }
  ],

  faq: [
    { icon: "help", question: "Y a-t-il un âge minimum pour participer ?", answer: "Le festival est accessible à tous les âges. Les mineurs doivent toutefois être accompagnés d'un adulte." },
    { icon: "directions_car", question: "Y a-t-il un parking disponible ?", answer: "Oui, un parking sécurisé et gratuit est mis à disposition des festivaliers près de l'entrée." },
    { icon: "restaurant", question: "Peut-on se restaurer sur place ?", answer: "Absolument ! De nombreux stands de restauration locale et internationale seront présents sur le site." },
    { icon: "umbrella", question: "Le festival se déroule-t-il en intérieur ou en extérieur en cas de pluie ?", answer: "Le festival est maintenu en cas de pluie. Des zones couvertes sont prévues sur l'ensemble du site." }
  ]
};