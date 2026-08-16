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
    { name: "Kévin Mavungu", discipline: "Chant, Afrobeat", category: "musique", image: "https://picsum.photos/seed/kevin-mavungu/400/400" },
    { name: "Maya Nsimba", discipline: "Chant, Soul & R&B", category: "musique", image: "https://picsum.photos/seed/maya-nsimba/400/400" },
    { name: "Darel Kossa", discipline: "DJ, Afro-house", category: "musique", image: "https://picsum.photos/seed/darel-kossa/400/400" },
    { name: "Léna Mpassi", discipline: "Stylisme, Haute couture", category: "mode", image: "https://picsum.photos/seed/lena-mpassi/400/400" },
    { name: "Chris Banzouzi", discipline: "Stylisme, Sape", category: "mode", image: "https://picsum.photos/seed/chris-banzouzi/400/400" },
    { name: "Noah Makosso", discipline: "Design vestimentaire", category: "mode", image: "https://picsum.photos/seed/noah-makosso/400/400" },
    { name: "Élodie Ngalula", discipline: "Installation lumineuse", category: "art", image: "https://picsum.photos/seed/elodie-ngalula/400/400" },
    { name: "Marc Elonga", discipline: "Art numérique", category: "art", image: "https://picsum.photos/seed/marc-elonga/400/400" },
    { name: "Sarah Mouzinga", discipline: "Sculpture lumineuse", category: "art", image: "https://picsum.photos/seed/sarah-mouzinga/400/400" }
  ]
};