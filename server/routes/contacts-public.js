const express = require('express');

function contactsPublicRoutes(db) {
  const router = express.Router();

  router.post('/', (req, res) => {
    const { name, phone, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'name et message requis' });
    }
    const result = db.prepare(
      'INSERT INTO contacts (name, phone, message) VALUES (?, ?, ?)'
    ).run(name, phone || '', message);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Message envoyé' });
  });

  return router;
}

module.exports = contactsPublicRoutes;
