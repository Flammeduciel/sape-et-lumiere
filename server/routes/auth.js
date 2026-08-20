const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

function authRoutes(db) {
  const router = express.Router();

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username et password requis' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });

  router.post('/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const hash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, user.id);
    res.json({ message: 'Mot de passe mis à jour' });
  });

  return router;
}

module.exports = authRoutes;
