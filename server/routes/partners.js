const express = require('express');

function partnersRoutes(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const partners = db.prepare('SELECT * FROM partners ORDER BY sort_order').all();
    res.json(partners);
  });

  router.get('/:id', (req, res) => {
    const partner = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partenaire non trouvé' });
    res.json(partner);
  });

  router.post('/', (req, res) => {
    const { name, image, website, sort_order } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name requis' });
    }
    const result = db.prepare(
      'INSERT INTO partners (name, image, website, sort_order) VALUES (?, ?, ?, ?)'
    ).run(name, image || '', website || '', sort_order || 0);
    res.status(201).json({ id: result.lastInsertRowid, name, image, website, sort_order });
  });

  router.put('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Partenaire non trouvé' });

    const { name, image, website, active, sort_order } = req.body;
    db.prepare(
      'UPDATE partners SET name = ?, image = ?, website = ?, active = ?, sort_order = ? WHERE id = ?'
    ).run(
      name ?? existing.name, image ?? existing.image,
      website ?? existing.website, active !== undefined ? (active ? 1 : 0) : existing.active,
      sort_order ?? existing.sort_order, req.params.id
    );
    res.json({ id: Number(req.params.id), ...existing, ...req.body });
  });

  router.delete('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM partners WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Partenaire non trouvé' });
    db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
    res.json({ message: 'Supprimé' });
  });

  return router;
}

module.exports = partnersRoutes;
