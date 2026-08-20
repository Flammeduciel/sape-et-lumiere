const express = require('express');

function artistsRoutes(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const { category } = req.query;
    let artists;
    if (category && category !== 'tous') {
      artists = db.prepare('SELECT * FROM artists WHERE category = ? ORDER BY name').all(category);
    } else {
      artists = db.prepare('SELECT * FROM artists ORDER BY name').all();
    }
    res.json(artists);
  });

  router.get('/:id', (req, res) => {
    const artist = db.prepare('SELECT * FROM artists WHERE id = ?').get(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artiste non trouvé' });
    res.json(artist);
  });

  router.post('/', (req, res) => {
    const { name, discipline, category, image, bio, social_instagram, social_youtube, social_spotify, social_website, social_soundcloud, social_mixcloud, social_behance, social_github } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'name et category requis' });
    }
    const result = db.prepare(
      `INSERT INTO artists (name, discipline, category, image, bio, social_instagram, social_youtube, social_spotify, social_website, social_soundcloud, social_mixcloud, social_behance, social_github) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(name, discipline, category, image, bio, social_instagram, social_youtube, social_spotify, social_website, social_soundcloud, social_mixcloud, social_behance, social_github);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  });

  router.put('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM artists WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Artiste non trouvé' });

    const fields = ['name', 'discipline', 'category', 'image', 'bio', 'social_instagram', 'social_youtube', 'social_spotify', 'social_website', 'social_soundcloud', 'social_mixcloud', 'social_behance', 'social_github'];
    const updates = fields.map(f => `${f} = ?`);
    const values = fields.map(f => req.body[f] ?? existing[f]);
    values.push(req.params.id);

    db.prepare(`UPDATE artists SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    res.json({ id: Number(req.params.id), ...existing, ...req.body });
  });

  router.delete('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM artists WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Artiste non trouvé' });
    db.prepare('DELETE FROM artists WHERE id = ?').run(req.params.id);
    res.json({ message: 'Supprimé' });
  });

  return router;
}

module.exports = artistsRoutes;
