const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'festival.db');

function initDatabase() {
  const db = new Database(DB_PATH);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS programme (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      time TEXT NOT NULL,
      title TEXT NOT NULL,
      icon TEXT DEFAULT 'event',
      image TEXT,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      discipline TEXT,
      category TEXT NOT NULL,
      image TEXT,
      bio TEXT,
      social_instagram TEXT,
      social_youtube TEXT,
      social_spotify TEXT,
      social_website TEXT,
      social_soundcloud TEXT,
      social_mixcloud TEXT,
      social_behance TEXT,
      social_github TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      details TEXT,
      popular INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER,
      client_name TEXT,
      client_phone TEXT,
      client_message TEXT,
      status TEXT DEFAULT 'pending',
      whatsapp_sent INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES tickets(id)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT,
      website TEXT,
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faq (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT DEFAULT 'help',
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT,
      ip_address TEXT,
      user_agent TEXT,
      visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: add image column to programme if missing
  const programmeCols = db.prepare("PRAGMA table_info(programme)").all();
  if (!programmeCols.some(c => c.name === 'image')) {
    db.exec("ALTER TABLE programme ADD COLUMN image TEXT");
  }

  return db;
}

function seedDatabase(db) {
  const userExists = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userExists.count === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', hash, 'admin');
  }

  const programmeExists = db.prepare('SELECT COUNT(*) as count FROM programme').get();
  if (programmeExists.count === 0) {
    const insert = db.prepare('INSERT INTO programme (day, time, title, icon, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)');

    const vendredi = [
      ['vendredi', '18:00-19:00', 'Ouverture des portes', 'door_open', 'Accueil et enregistrement des participants', 1],
      ['vendredi', '19:00-20:30', 'Défilé de mode – Sape & Créateurs', 'checkroom', 'Créateurs congolais et sapeurs sur le podium', 2],
      ['vendredi', '20:30-22:00', 'Concert Live', 'music_note', 'Performance live sur la scène principale', 3],
      ['vendredi', '22:00-23:30', 'Art Lumière – Installation', 'lightbulb', 'Parcours immersif de lumière et d\'art', 4],
      ['vendredi', '23:30-01:00', 'DJ Set & Ambiance', 'graphic_eq', 'Soirée danse avec les meilleurs DJs', 5],
    ];
    const samedi = [
      ['samedi', '14:00-15:30', 'Atelier Sape & Style', 'palette', 'Apprenez l\'art de la sape avec les maîtres', 1],
      ['samedi', '15:30-17:00', 'Duel Musical', 'sports_martial_arts', 'Affrontement musical entre artistes', 2],
      ['samedi', '17:00-18:30', 'Défilé de Créateurs', 'checkroom', 'Nouvelles collections et tendances', 3],
      ['samedi', '18:30-20:00', 'Concert Principal', 'star', 'Tête d\'affiche de la soirée', 4],
      ['samedi', '20:00-22:00', 'Nuit Lumière', 'nightlight', 'Spectacle luminaire géant', 5],
    ];
    const dimanche = [
      ['dimanche', '15:00-16:30', 'Brunch Élégance', 'restaurant', 'Repas raffiné en bonne compagnie', 1],
      ['dimanche', '16:30-18:00', 'Performance Art', 'theater_comedy', 'Arts de la scène et performances live', 2],
      ['dimanche', '18:00-19:30', 'Concert de Clôture', 'celebration', 'La grande finale musicale', 3],
      ['dimanche', '19:30-21:00', 'Spectacle Lumière Finale', 'auto_awesome', 'Clôture magique avec feux d\'artifice', 4],
    ];

    const insertMany = db.transaction((events) => {
      for (const e of events) insert.run(...e);
    });
    insertMany([...vendredi, ...samedi, ...dimanche]);
  }

  const artistsExists = db.prepare('SELECT COUNT(*) as count FROM artists').get();
  if (artistsExists.count === 0) {
    const insert = db.prepare(`INSERT INTO artists (name, discipline, category, image, bio, social_instagram, social_youtube, social_spotify, social_website, social_soundcloud, social_mixcloud, social_behance, social_github) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const artists = [
      ['Kévin Mavungu', 'Chant, Afrobeat', 'musique', 'assets/images/artists/musique_1.jpg', 'Figure montante de l\'afrobeat congolais.', '#', '#', '#', null, null, null, null, null],
      ['Maya Nsimba', 'Chant, Soul & R&B', 'musique', 'assets/images/artists/musique_2.jpeg', 'Voix veloutée de la scène soul brazzavilloise.', '#', '#', '#', null, null, null, null, null],
      ['Darel Kossa', 'DJ, Afro-house', 'musique', 'assets/images/artists/musique_3.jpeg', 'Maître des dancefloors de la capitale.', '#', null, null, null, '#', '#', null, null],
      ['Léna Mpassi', 'Stylisme, Haute couture', 'mode', 'assets/images/artists/sapeur_1.jpg', 'Créatrice de la maison \'Mpassi Atelier\'.', '#', null, null, '#', null, null, null, null],
      ['Chris Banzouzi', 'Stylisme, Sape', 'mode', 'assets/images/artists/sapeur_2.jpeg', 'Ambassadeur de la sape moderne.', '#', null, null, '#', null, null, null, null],
      ['Noah Makosso', 'Design vestimentaire', 'mode', 'assets/images/artists/sapeur_3.jpeg', 'Designer pluridisciplinaire.', '#', null, null, null, null, null, '#', null],
      ['Élodie Ngalula', 'Installation lumineuse', 'art', 'assets/images/artists/lumiere_1.jpg', 'Artiste lumière formée à l\'École des Beaux-Arts.', '#', null, null, '#', null, null, null, null],
      ['Marc Elonga', 'Art numérique', 'art', 'assets/images/artists/lumiere_2.jpg', 'Pionnier du digital art en Afrique centrale.', '#', null, null, '#', null, null, null, '#'],
      ['Sarah Mouzinga', 'Sculpture lumineuse', 'art', 'assets/images/artists/lumiere_3.jpg', 'Sculptrice de lumière.', '#', null, null, '#', null, null, null, null],
    ];

    const insertMany = db.transaction((list) => {
      for (const a of list) insert.run(...a);
    });
    insertMany(artists);
  }

  const ticketsExists = db.prepare('SELECT COUNT(*) as count FROM tickets').get();
  if (ticketsExists.count === 0) {
    const insert = db.prepare('INSERT INTO tickets (name, price, details, popular) VALUES (?, ?, ?, ?)');
    insert.run('PASS 1 JOUR', '5 000 FCFA', 'Accès à toutes les activités du jour sélectionné.', 0);
    insert.run('PASS 3 JOURS', '12 000 FCFA', 'Accès aux 3 jours de festival, toutes les activités.', 1);
  }

  const partnersExists = db.prepare('SELECT COUNT(*) as count FROM partners').get();
  if (partnersExists.count === 0) {
    const insert = db.prepare('INSERT INTO partners (name, image, sort_order) VALUES (?, ?, ?)');
    const partners = [
      ['Akieni', 'assets/images/parteners/akieni.svg', 1],
      ['Airtel', 'assets/images/parteners/airtel.svg', 2],
      ['MTN', 'assets/images/parteners/mtn.svg', 3],
      ['Canal+', 'assets/images/parteners/canal_plus.svg', 4],
      ['Total', 'assets/images/parteners/total.svg', 5],
      ['ENI', 'assets/images/parteners/eni.svg', 6],
    ];
    const insertMany = db.transaction((list) => {
      for (const p of list) insert.run(...p);
    });
    insertMany(partners);
  }

  const faqExists = db.prepare('SELECT COUNT(*) as count FROM faq').get();
  if (faqExists.count === 0) {
    const insert = db.prepare('INSERT INTO faq (icon, question, answer, sort_order) VALUES (?, ?, ?, ?)');
    const faqItems = [
      ['confirmation_number', 'Comment réserver un billet ?', 'Les réservations se font uniquement via WhatsApp. Cliquez sur le bouton "Réserver" et envoyez-nous un message avec le pass souhaité.', 1],
      ['schedule', 'Quels sont les horaires du festival ?', 'Le festival se tient du 18 au 20 septembre 2026. Ouverture des portes à 18h le vendredi, dès 14h le samedi et dimanche.', 2],
      ['location_on', 'Où se déroule le festival ?', 'À l\'Esplanade du Palais des Congrès à Brazzaville. Parking gratuit et sécurisé sur place.', 3],
      ['payments', 'Quels moyens de paiement acceptés ?', 'Paiement mobile (M-Pay, Airtel Money, MTN Mobile Money) ou en espèces sur place.', 4],
    ];
    const insertMany = db.transaction((list) => {
      for (const f of list) insert.run(...f);
    });
    insertMany(faqItems);
  }

  const settingsExists = db.prepare('SELECT COUNT(*) as count FROM settings').get();
  if (settingsExists.count === 0) {
    const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    insert.run('festival_name', 'Sape & Lumière');
    insert.run('festival_tagline', 'ÉLÉGANCE · CULTURE · LUMIÈRE');
    insert.run('festival_date', '2026-09-18T18:00:00');
    insert.run('festival_label', 'DU 18 AU 20 SEPTEMBRE 2026');
    insert.run('whatsapp_number', '242060000000');
    insert.run('hero_title', 'FESTIVAL SAPE & LUMIÈRE');
    insert.run('hero_desc', '3 JOURS DE CULTURE, D\'ÉLÉGANCE ET DE LUMIÈRE À BRAZZAVILLE');
  }
}

module.exports = { initDatabase, seedDatabase };
