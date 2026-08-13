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
      { time: "16:00", title: "Ouverture des portes", icon: "door_open", desc: "Accueil et enregistrement des participants" },
      { time: "17:00", title: "Défilé de mode – Sape & Créateurs", icon: "checkroom", desc: "Créateurs congolais et sapeurs sur le podium" },
      { time: "19:00", title: "Concert Live", icon: "music_note", desc: "Performance live sur la scène principale" },
      { time: "21:00", title: "Art Lumière – Installation", icon: "lightbulb", desc: "Parcours immersif de lumière et d'art" },
      { time: "22:30", title: "DJ Set & Ambiance", icon: "graphic_eq", desc: "Soirée danse avec les meilleurs DJs" }
    ],
    samedi: [
      { time: "14:00", title: "Atelier Sape & Style", icon: "palette", desc: "Apprenez l'art de la sape avec les maîtres" },
      { time: "16:00", title: "Duel Musical", icon: "sports_martial_arts", desc: "Affrontement musical entre artistes" },
      { time: "18:00", title: "Défilé de Créateurs", icon: "checkroom", desc: "Nouvelles collections et tendances" },
      { time: "20:00", title: "Concert Principal", icon: "star", desc: "Tête d'affiche de la soirée" },
      { time: "22:00", title: "Nuit Lumière", icon: "nightlight", desc: "Spectacle luminaire géant" }
    ],
    dimanche: [
      { time: "15:00", title: "Brunch Élégance", icon: "restaurant", desc: "Repas raffiné en bonne compagnie" },
      { time: "17:00", title: "Performance Art", icon: "theater_comedy", desc: "Arts de la scène et performances live" },
      { time: "19:00", title: "Concert de Clôture", icon: "celebration", desc: "La grande finale musicale" },
      { time: "21:00", title: "Spectacle Lumière Finale", icon: "auto_awesome", desc: "Clôture magique avec feux d'artifice" }
    ]
  }
};