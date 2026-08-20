const express = require('express');

function programmeRoutes(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const { day } = req.query;
    let events;
    if (day) {
      events = db.prepare('SELECT * FROM programme WHERE day = ? ORDER BY sort_order').all(day);
    } else {
      events = db.prepare('SELECT * FROM programme ORDER BY day, sort_order').all();
    }
    res.json(events);
  });

  router.get('/:id', (req, res) => {
    const event = db.prepare('SELECT * FROM programme WHERE id = ?').get(req.params.id);
    if (!event) return res.status(404).json({ error: 'Événement non trouvé' });
    res.json(event);
  });

  router.post('/', (req, res) => {
    const { day, time, title, icon, image, description, sort_order } = req.body;
    if (!day || !time || !title) {
      return res.status(400).json({ error: 'day, time et title requis' });
    }
    const result = db.prepare(
      'INSERT INTO programme (day, time, title, icon, image, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(day, time, title, icon || 'event', image || null, description || '', sort_order || 0);
    res.status(201).json({ id: result.lastInsertRowid, day, time, title, icon, image, description, sort_order });
  });

  router.put('/:id', (req, res) => {
    const { day, time, title, icon, image, description, sort_order } = req.body;
    const existing = db.prepare('SELECT * FROM programme WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Événement non trouvé' });

    db.prepare(
      'UPDATE programme SET day = ?, time = ?, title = ?, icon = ?, image = ?, description = ?, sort_order = ? WHERE id = ?'
    ).run(
      day ?? existing.day, time ?? existing.time, title ?? existing.title,
      icon ?? existing.icon, image ?? existing.image,
      description ?? existing.description,
      sort_order ?? existing.sort_order, req.params.id
    );
    res.json({ id: Number(req.params.id), day, time, title, icon, image, description, sort_order });
  });

  router.delete('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM programme WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Événement non trouvé' });
    db.prepare('DELETE FROM programme WHERE id = ?').run(req.params.id);
    res.json({ message: 'Supprimé' });
  });

  return router;
}

module.exports = programmeRoutes;
