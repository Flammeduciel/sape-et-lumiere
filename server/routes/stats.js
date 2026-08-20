const express = require('express');

function statsRoutes(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const totalArtists = db.prepare('SELECT COUNT(*) as count FROM artists').get().count;
    const totalEvents = db.prepare('SELECT COUNT(*) as count FROM programme').get().count;
    const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count;
    const unreadContacts = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE read = 0').get().count;
    const totalPartners = db.prepare('SELECT COUNT(*) as count FROM partners').get().count;
    const totalFaq = db.prepare('SELECT COUNT(*) as count FROM faq').get().count;
    const totalTickets = db.prepare('SELECT COUNT(*) as count FROM tickets').get().count;
    const totalVisits = db.prepare('SELECT COUNT(*) as count FROM site_visits').get().count;

    const todayVisits = db.prepare(
      "SELECT COUNT(*) as count FROM site_visits WHERE date(visited_at) = date('now')"
    ).get().count;

    const recentContacts = db.prepare(
      'SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5'
    ).all();

    const eventsByDay = db.prepare(
      'SELECT day, COUNT(*) as count FROM programme GROUP BY day'
    ).all();

    res.json({
      totals: {
        artists: totalArtists,
        events: totalEvents,
        contacts: totalContacts,
        unreadContacts,
        partners: totalPartners,
        faq: totalFaq,
        tickets: totalTickets,
        visits: totalVisits,
        todayVisits,
      },
      recentContacts,
      eventsByDay,
    });
  });

  return router;
}

module.exports = statsRoutes;
