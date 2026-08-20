const express = require('express');

function faqRoutes(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const faqs = db.prepare('SELECT * FROM faq ORDER BY sort_order').all();
    res.json(faqs);
  });

  router.get('/:id', (req, res) => {
    const faq = db.prepare('SELECT * FROM faq WHERE id = ?').get(req.params.id);
    if (!faq) return res.status(404).json({ error: 'FAQ non trouvé' });
    res.json(faq);
  });

  router.post('/', (req, res) => {
    const { icon, question, answer, sort_order } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'question et answer requis' });
    }
    const result = db.prepare(
      'INSERT INTO faq (icon, question, answer, sort_order) VALUES (?, ?, ?, ?)'
    ).run(icon || 'help', question, answer, sort_order || 0);
    res.status(201).json({ id: result.lastInsertRowid, icon, question, answer, sort_order });
  });

  router.put('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM faq WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'FAQ non trouvé' });

    const { icon, question, answer, sort_order } = req.body;
    db.prepare(
      'UPDATE faq SET icon = ?, question = ?, answer = ?, sort_order = ? WHERE id = ?'
    ).run(
      icon ?? existing.icon, question ?? existing.question,
      answer ?? existing.answer, sort_order ?? existing.sort_order, req.params.id
    );
    res.json({ id: Number(req.params.id), ...existing, ...req.body });
  });

  router.delete('/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM faq WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'FAQ non trouvé' });
    db.prepare('DELETE FROM faq WHERE id = ?').run(req.params.id);
    res.json({ message: 'Supprimé' });
  });

  return router;
}

module.exports = faqRoutes;
