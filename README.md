# Festival Sape & Lumière

Site vitrine du **Festival Sape & Lumière**, événement culturel annuel organisé à **Brazzaville** et consacré en trois jours à l'élégance de la Sape congolaise, à la musique live et aux installations d'art lumineux dans l'espace public.

Le site présente le programme, met en valeur les artistes invités et oriente le public vers la réservation via **WhatsApp** (il n'y a pas de billetterie en ligne).

## Contexte du projet

Ce site est réalisé dans le cadre du **cas pratique S10 — Akieni Academy, Cohorte 2**, en binôme **Business Analyst × Full Stack** :

- le **Business Analyst** cadre le besoin, écrit et priorise les tickets, anime le tableau Kanban et valide les livrables ;
- le **Full Stack** développe les pages en HTML / CSS / JavaScript à partir de ces tickets.

L'objectif : livrer un site démontrable en une semaine, prêt à être présenté au comité organisateur du festival.

## Fonctionnalités

| Section | Contenu |
| --- | --- |
| **Accueil** | Bannière avec photo, nom du festival, dates et **compte à rebours dynamique** jusqu'au vendredi d'ouverture |
| **Programme** | Trois onglets cliquables (Vendredi / Samedi / Dimanche), un seul jour affiché à la fois, horaires et activités |
| **Line-up** | Grille d'artistes et créateurs avec photo, nom et discipline ; **filtre par catégorie** (Musique / Mode et Sape / Art Lumière) |
| **Billetterie** | Deux formules (Pass 1 jour, Pass 3 jours) avec prix et bouton **« Réserver via WhatsApp »** pré-rempli par formule |
| **Partenaires** | Section sobre avec les logos des partenaires |
| **FAQ** | Accordéon de questions/réponses (âge minimum, restauration, parking, intérieur/extérieur) |
| **Contact** | Formulaire nom / téléphone / message avec validation JavaScript des champs obligatoires |
| **Navigation** | Menu mobile (hamburger), site responsive **mobile-first** |

Les cinq éléments JavaScript du site : compte à rebours, onglets du programme, filtre du line-up, menu mobile et validation du formulaire.

## Stack technique

- **HTML5** — structure des pages
- **CSS3** — mise en page et responsive (mobile-first)
- **JavaScript vanilla** — interactions et dynamisme

Pas de framework, pas de backend. Les données (programme, line-up, tarifs) sont centralisées dans un fichier JavaScript.

## Structure du projet

```
sape-1/
├── index.html
└── assets/
    ├── css/
    │   ├── base.css
    │   ├── variables.css
    │   ├── layout.css
    │   ├── components.css
    │   └── main.css
    ├── js/
    │   ├── data.js
    │   └── app.js
    └── images/
```

- `index.html` — page unique du site, organisée en sections
- `assets/js/data.js` — toutes les données du festival (dates, programme, line-up, tarifs…)
- `assets/js/app.js` — compteur à rebours, onglets, filtres, menu mobile, validation du formulaire
- `assets/css/` — styles découpés par rôle (variables, base, layout, composants, point d'entrée)

## Démarrage

Le site étant en HTML/CSS/JS pur, il se lance directement :

1. Ouvrir `index.html` dans un navigateur.

Ou, pour un environnement plus proche d'un serveur réel :

```bash
python -m http.server
# puis ouvrir http://localhost:8000
```

## Équipe

- **Business Analyst** : _Flamme Du Ciel WASSANGOU_
- **Full Stack** : _Grace Chatel NDOUOLO_

## Crédits

Site réalisé dans le cadre du parcours Akieni Academy — Cohorte 2 (cas pratique S10, Business Analyst × Full Stack).
