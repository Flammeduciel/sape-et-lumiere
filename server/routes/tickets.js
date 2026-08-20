const express = require('express');

function ticketsRoutes(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const tickets = db.prepare('SELECT * FROM tickets ORDER BY price').all();
    res.json(tickets);
  });

  router.get('/:id', (req, res) => {
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Billet non trouvé' });
    res.json(ticket);
  });

  router.post('/', (req, res) => {
    const { name, price, details, popular } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'name et price requis' });
    }
    const result = db.prepare(
      'INSERT INTO tickets (name, price, details, popular) VALUES (?, ?, ?, ?)'
    ).run(name, price, details || '', popular ? 1 : 0);
    res.status(201).json({ id: result.lastInsertRowid, name, price, details, popular });
  });

  router.put('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Billet non trouvé' });

    const { name, price, details, popular, active } = req.body;
    db.prepare(
      'UPDATE tickets SET name = ?, price = ?, details = ?, popular = ?, active = ? WHERE id = ?'
    ).run(
      name ?? existing.name, price ?? existing.price,
      details ?? existing.details, popular !== undefined ? (popular ? 1 : 0) : existing.popular,
      active !== undefined ? (active ? 1 : 0) : existing.active, req.params.id
    );
    res.json({ id: Number(req.params.id), ...existing, ...req.body });
  });

  router.delete('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Billet non trouvé' });
    db.prepare('DELETE FROM tickets WHERE id = ?').run(req.params.id);
    res.json({ message: 'Supprimé' });
  });

  return router;
}

module.exports = ticketsRoutes;
