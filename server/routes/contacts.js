const express = require('express');

function contactsRoutes(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json(contacts);
  });

  router.get('/:id', (req, res) => {
    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Message non trouvé' });
    res.json(contact);
  });

  router.post('/', (req, res) => {
    const { name, phone, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'name et message requis' });
    }
    const result = db.prepare(
      'INSERT INTO contacts (name, phone, message) VALUES (?, ?, ?)'
    ).run(name, phone || '', message);
    res.status(201).json({ id: result.lastInsertRowid, name, phone, message, read: 0 });
  });

  router.put('/:id/read', (req, res) => {
    const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Message non trouvé' });
    db.prepare('UPDATE contacts SET read = 1 WHERE id = ?').run(req.params.id);
    res.json({ ...existing, read: 1 });
  });

  router.delete('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Message non trouvé' });
    db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
    res.json({ message: 'Supprimé' });
  });

  return router;
}

module.exports = contactsRoutes;
