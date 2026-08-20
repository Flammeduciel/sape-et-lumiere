const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, seedDatabase } = require('./database');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

const db = initDatabase();
seedDatabase(db);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

const authRoutes = require('./routes/auth');
const programmeRoutes = require('./routes/programme');
const artistsRoutes = require('./routes/artists');
const ticketsRoutes = require('./routes/tickets');
const contactsRoutes = require('./routes/contacts');
const partnersRoutes = require('./routes/partners');
const faqRoutes = require('./routes/faq');
const statsRoutes = require('./routes/stats');

app.use('/api/auth', authRoutes(db));
app.use('/api/programme', programmeRoutes(db));
app.use('/api/artists', artistsRoutes(db));
app.use('/api/tickets', ticketsRoutes(db));
app.use('/api/contacts', authMiddleware, contactsRoutes(db));
app.use('/api/partners', partnersRoutes(db));
app.use('/api/faq', faqRoutes(db));
app.use('/api/stats', authMiddleware, statsRoutes(db));

app.use('/dashboard', express.static(path.join(__dirname, '..', 'dashboard')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dashboard', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
