(() => {
  const API = '';
  let token = localStorage.getItem('token');
  let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  let currentPage = 'stats';

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const headers = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  async function api(path, opts = {}) {
    const res = await fetch(`${API}/api${path}`, {
      ...opts,
      headers: headers()
    });
    if (res.status === 401) { logout(); return null; }
    return res.json();
  }

  /* ── AUTH ── */
  function showLogin() {
    $('#login-page').style.display = 'flex';
    $('#dashboard').style.display = 'none';
  }

  function showDashboard() {
    $('#login-page').style.display = 'none';
    $('#dashboard').style.display = 'flex';
    $('#topbar-user').textContent = currentUser?.username || '';
    loadPage('stats');
  }

  function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showLogin();
  }

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = $('#login-username').value.trim();
    const password = $('#login-password').value;
    if (!username || !password) return;

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.error) {
        $('#login-error').textContent = data.error;
        return;
      }
      token = data.token;
      currentUser = data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(currentUser));
      showDashboard();
    } catch (err) {
      $('#login-error').textContent = 'Erreur de connexion';
    }
  });

  $('#logout-btn').addEventListener('click', (e) => { e.preventDefault(); logout(); });

  /* ── NAV ── */
  $$('.sidebar-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      loadPage(page);
      $$('.sidebar-link[data-page]').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      $('#sidebar').classList.remove('open');
    });
  });

  $('#hamburger-btn').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
  });

  const pageTitles = {
    stats: 'Statistiques',
    programme: 'Programme',
    artists: 'Artistes',
    tickets: 'Billetterie',
    contacts: 'Messages',
    partners: 'Partenaires',
    faq: 'FAQ',
  };

  function loadPage(page) {
    currentPage = page;
    $('#topbar-title').textContent = pageTitles[page] || page;
    const renderers = { stats: renderStats, programme: renderProgramme, artists: renderArtists, tickets: renderTickets, contacts: renderContacts, partners: renderPartners, faq: renderFaq };
    if (renderers[page]) renderers[page]();
  }

  /* ── STATS ── */
  async function renderStats() {
    const data = await api('/stats');
    if (!data) return;
    const t = data.totals;

    $('#content').innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon green"><span class="material-symbols-outlined">group</span></div>
          <div class="stat-info"><h3>${t.artists}</h3><p>Artistes</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon yellow"><span class="material-symbols-outlined">event</span></div>
          <div class="stat-info"><h3>${t.events}</h3><p>Événements</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red"><span class="material-symbols-outlined">mail</span></div>
          <div class="stat-info"><h3>${t.unreadContacts}</h3><p>Messages non lus</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><span class="material-symbols-outlined">handshake</span></div>
          <div class="stat-info"><h3>${t.partners}</h3><p>Partenaires</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon yellow"><span class="material-symbols-outlined">help</span></div>
          <div class="stat-info"><h3>${t.faq}</h3><p>FAQ</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><span class="material-symbols-outlined">confirmation_number</span></div>
          <div class="stat-info"><h3>${t.tickets}</h3><p>Types de billets</p></div>
        </div>
      </div>
      <div class="section-header"><h3>Messages récents</h3></div>
      ${data.recentContacts.length ? `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Nom</th><th>Téléphone</th><th>Message</th><th>Date</th></tr></thead>
            <tbody>
              ${data.recentContacts.map(c => `
                <tr>
                  <td>${esc(c.name)}</td>
                  <td>${esc(c.phone || '-')}</td>
                  <td>${esc(c.message).substring(0, 60)}${c.message.length > 60 ? '...' : ''}</td>
                  <td>${new Date(c.created_at).toLocaleDateString('fr')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<div class="empty-state"><span class="material-symbols-outlined">inbox</span><p>Aucun message</p></div>'}
    `;
  }

  /* ── PROGRAMME ── */
  async function renderProgramme() {
    const events = await api('/programme');
    if (!events) return;

    const days = { vendredi: [], samedi: [], dimanche: [] };
    events.forEach(e => { if (days[e.day]) days[e.day].push(e); });

    let tableHTML = '';
    for (const [day, items] of Object.entries(days)) {
      if (items.length) {
        tableHTML += `
          <tr><td colspan="6" style="font-weight:700;text-transform:uppercase;color:var(--yellow);background:var(--bg-input);">${day}</td></tr>
          ${items.map(e => `
            <tr>
              <td>${e.image ? `<img src="/${e.image}" class="table-thumb" alt="${esc(e.title)}"/>` : '<span class="material-symbols-outlined" style="opacity:0.3;font-size:1.5rem;">image</span>'}</td>
              <td>${esc(e.time)}</td>
              <td><span class="material-symbols-outlined" style="font-size:1rem;vertical-align:middle;margin-right:0.3rem;">${e.icon}</span>${esc(e.title)}</td>
              <td>${esc(e.description || '-')}</td>
              <td>${e.sort_order}</td>
              <td class="table-actions">
                <button class="btn btn-outline btn-sm" onclick="editProgramme(${e.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProgramme(${e.id})">Suppr</button>
              </td>
            </tr>
          `).join('')}
        `;
      }
    }

    $('#content').innerHTML = `
      <div class="section-header">
        <h3>Programme du festival</h3>
        <button class="btn btn-primary" onclick="addProgramme()">+ Ajouter</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Image</th><th>Horaires</th><th>Événement</th><th>Description</th><th>Ordre</th><th>Actions</th></tr></thead>
          <tbody>${tableHTML}</tbody>
        </table>
      </div>
    `;
  }

  window.addProgramme = async () => {
    openModal('Ajouter un événement', `
      <label>Jour</label>
      <select id="m-day"><option value="vendredi">Vendredi</option><option value="samedi">Samedi</option><option value="dimanche">Dimanche</option></select>
      <label>Horaires</label>
      <input class="form-input" id="m-time" placeholder="18:00-19:00" required/>
      <label>Titre</label>
      <input class="form-input" id="m-title" placeholder="Titre" required/>
      <label>Icône</label>
      <input class="form-input" id="m-icon" placeholder="event" value="event"/>
      ${imageUploadField('', 'm-image')}
      <label>Description</label>
      <input class="form-input" id="m-desc" placeholder="Description"/>
      <label>Ordre</label>
      <input class="form-input" id="m-order" type="number" value="0"/>
    `, async () => {
      const image = await uploadIfSelected('m-image');
      await api('/programme', { method: 'POST', body: JSON.stringify({
        day: $('#m-day').value, time: $('#m-time').value, title: $('#m-title').value,
        icon: $('#m-icon').value, image, description: $('#m-desc').value, sort_order: Number($('#m-order').value)
      })});
      closeModal();
      renderProgramme();
    });
    bindImagePreview('m-image');
  };

  window.editProgramme = async (id) => {
    const e = await api(`/programme/${id}`);
    if (!e) return;
    openModal('Modifier l\'événement', `
      <label>Jour</label>
      <select id="m-day"><option value="vendredi" ${e.day==='vendredi'?'selected':''}>Vendredi</option><option value="samedi" ${e.day==='samedi'?'selected':''}>Samedi</option><option value="dimanche" ${e.day==='dimanche'?'selected':''}>Dimanche</option></select>
      <label>Horaires</label>
      <input class="form-input" id="m-time" value="${esc(e.time)}"/>
      <label>Titre</label>
      <input class="form-input" id="m-title" value="${esc(e.title)}"/>
      <label>Icône</label>
      <input class="form-input" id="m-icon" value="${esc(e.icon)}"/>
      ${imageUploadField(e.image || '', 'm-image')}
      <label>Description</label>
      <input class="form-input" id="m-desc" value="${esc(e.description || '')}"/>
      <label>Ordre</label>
      <input class="form-input" id="m-order" type="number" value="${e.sort_order}"/>
    `, async () => {
      const image = await uploadIfSelected('m-image');
      await api(`/programme/${id}`, { method: 'PUT', body: JSON.stringify({
        day: $('#m-day').value, time: $('#m-time').value, title: $('#m-title').value,
        icon: $('#m-icon').value, image, description: $('#m-desc').value, sort_order: Number($('#m-order').value)
      })});
      closeModal();
      renderProgramme();
    });
    bindImagePreview('m-image');
  };

  window.deleteProgramme = async (id) => {
    if (!confirm('Supprimer cet événement ?')) return;
    await api(`/programme/${id}`, { method: 'DELETE' });
    renderProgramme();
  };

  /* ── ARTISTS ── */
  async function renderArtists() {
    const artists = await api('/artists');
    if (!artists) return;

    $('#content').innerHTML = `
      <div class="section-header">
        <h3>Artistes & Créateurs</h3>
        <button class="btn btn-primary" onclick="addArtist()">+ Ajouter</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Image</th><th>Nom</th><th>Discipline</th><th>Catégorie</th><th>Actions</th></tr></thead>
          <tbody>
            ${artists.map(a => `
              <tr>
                <td>${a.image ? `<img src="/${a.image}" class="table-thumb" alt="${esc(a.name)}"/>` : '<span class="material-symbols-outlined" style="opacity:0.3;font-size:1.5rem;">image</span>'}</td>
                <td style="font-weight:600;">${esc(a.name)}</td>
                <td>${esc(a.discipline || '-')}</td>
                <td><span class="badge badge-${a.category==='musique'?'green':a.category==='mode'?'yellow':'red'}">${a.category}</span></td>
                <td class="table-actions">
                  <button class="btn btn-outline btn-sm" onclick="editArtist(${a.id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteArtist(${a.id})">Suppr</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  window.addArtist = async () => {
    openModal('Ajouter un artiste', `
      <label>Nom</label>
      <input class="form-input" id="m-name" required/>
      <label>Discipline</label>
      <input class="form-input" id="m-discipline"/>
      <label>Catégorie</label>
      <select id="m-category"><option value="musique">Musique</option><option value="mode">Mode & Sape</option><option value="art">Art Lumière</option></select>
      ${imageUploadField('', 'm-image')}
      <label>Bio</label>
      <input class="form-input" id="m-bio"/>
      <label>Instagram</label>
      <input class="form-input" id="m-insta"/>
    `, async () => {
      const image = await uploadIfSelected('m-image');
      await api('/artists', { method: 'POST', body: JSON.stringify({
        name: $('#m-name').value, discipline: $('#m-discipline').value, category: $('#m-category').value,
        image, bio: $('#m-bio').value, social_instagram: $('#m-insta').value || null
      })});
      closeModal();
      renderArtists();
    });
    bindImagePreview('m-image');
  };

  window.editArtist = async (id) => {
    const a = await api(`/artists/${id}`);
    if (!a) return;
    openModal('Modifier l\'artiste', `
      <label>Nom</label>
      <input class="form-input" id="m-name" value="${esc(a.name)}"/>
      <label>Discipline</label>
      <input class="form-input" id="m-discipline" value="${esc(a.discipline || '')}"/>
      <label>Catégorie</label>
      <select id="m-category"><option value="musique" ${a.category==='musique'?'selected':''}>Musique</option><option value="mode" ${a.category==='mode'?'selected':''}>Mode & Sape</option><option value="art" ${a.category==='art'?'selected':''}>Art Lumière</option></select>
      ${imageUploadField(a.image || '', 'm-image')}
      <label>Bio</label>
      <input class="form-input" id="m-bio" value="${esc(a.bio || '')}"/>
      <label>Instagram</label>
      <input class="form-input" id="m-insta" value="${esc(a.social_instagram || '')}"/>
    `, async () => {
      const image = await uploadIfSelected('m-image');
      await api(`/artists/${id}`, { method: 'PUT', body: JSON.stringify({
        name: $('#m-name').value, discipline: $('#m-discipline').value, category: $('#m-category').value,
        image, bio: $('#m-bio').value, social_instagram: $('#m-insta').value || null
      })});
      closeModal();
      renderArtists();
    });
    bindImagePreview('m-image');
  };

  window.deleteArtist = async (id) => {
    if (!confirm('Supprimer cet artiste ?')) return;
    await api(`/artists/${id}`, { method: 'DELETE' });
    renderArtists();
  };

  /* ── TICKETS ── */
  async function renderTickets() {
    const tickets = await api('/tickets');
    if (!tickets) return;

    $('#content').innerHTML = `
      <div class="section-header">
        <h3>Billetterie</h3>
        <button class="btn btn-primary" onclick="addTicket()">+ Ajouter</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Nom</th><th>Prix</th><th>Détails</th><th>Populaire</th><th>Actions</th></tr></thead>
          <tbody>
            ${tickets.map(t => `
              <tr>
                <td style="font-weight:600;">${esc(t.name)}</td>
                <td>${esc(t.price)}</td>
                <td>${esc(t.details || '-')}</td>
                <td>${t.popular ? '<span class="badge badge-yellow">Populaire</span>' : '-'}</td>
                <td class="table-actions">
                  <button class="btn btn-outline btn-sm" onclick="editTicket(${t.id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteTicket(${t.id})">Suppr</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  window.addTicket = async () => {
    openModal('Ajouter un billet', `
      <label>Nom</label>
      <input class="form-input" id="m-name" placeholder="PASS 1 JOUR" required/>
      <label>Prix</label>
      <input class="form-input" id="m-price" placeholder="5 000 FCFA" required/>
      <label>Détails</label>
      <input class="form-input" id="m-details"/>
      <label>Populaire</label>
      <select id="m-popular"><option value="0">Non</option><option value="1">Oui</option></select>
    `, async () => {
      await api('/tickets', { method: 'POST', body: JSON.stringify({
        name: $('#m-name').value, price: $('#m-price').value,
        details: $('#m-details').value, popular: Number($('#m-popular').value)
      })});
      closeModal();
      renderTickets();
    });
  };

  window.editTicket = async (id) => {
    const t = await api(`/tickets/${id}`);
    if (!t) return;
    openModal('Modifier le billet', `
      <label>Nom</label>
      <input class="form-input" id="m-name" value="${esc(t.name)}"/>
      <label>Prix</label>
      <input class="form-input" id="m-price" value="${esc(t.price)}"/>
      <label>Détails</label>
      <input class="form-input" id="m-details" value="${esc(t.details || '')}"/>
      <label>Populaire</label>
      <select id="m-popular"><option value="0" ${!t.popular?'selected':''}>Non</option><option value="1" ${t.popular?'selected':''}>Oui</option></select>
    `, async () => {
      await api(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify({
        name: $('#m-name').value, price: $('#m-price').value,
        details: $('#m-details').value, popular: Number($('#m-popular').value)
      })});
      closeModal();
      renderTickets();
    });
  };

  window.deleteTicket = async (id) => {
    if (!confirm('Supprimer ce billet ?')) return;
    await api(`/tickets/${id}`, { method: 'DELETE' });
    renderTickets();
  };

  /* ── CONTACTS ── */
  async function renderContacts() {
    const contacts = await api('/admin/contacts');
    if (!contacts) return;

    $('#content').innerHTML = `
      <div class="section-header">
        <h3>Messages de contact</h3>
      </div>
      ${contacts.length ? `
        <div class="table-wrap">
          <table>
            <thead><tr><th>Nom</th><th>Téléphone</th><th>Message</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              ${contacts.map(c => `
                <tr style="${!c.read ? 'background:rgba(154,211,177,0.04);' : ''}">
                  <td style="font-weight:600;">${esc(c.name)}</td>
                  <td>${esc(c.phone || '-')}</td>
                  <td>${esc(c.message).substring(0, 80)}${c.message.length > 80 ? '...' : ''}</td>
                  <td>${c.read ? '<span class="badge badge-green">Lu</span>' : '<span class="badge badge-red">Non lu</span>'}</td>
                  <td>${new Date(c.created_at).toLocaleDateString('fr')}</td>
                  <td class="table-actions">
                    ${!c.read ? `<button class="btn btn-outline btn-sm" onclick="markRead(${c.id})">Marquer lu</button>` : ''}
                    <button class="btn btn-danger btn-sm" onclick="deleteContact(${c.id})">Suppr</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<div class="empty-state"><span class="material-symbols-outlined">inbox</span><p>Aucun message</p></div>'}
    `;
  }

  window.markRead = async (id) => {
    await api(`/admin/contacts/${id}/read`, { method: 'PUT' });
    renderContacts();
  };

  window.deleteContact = async (id) => {
    if (!confirm('Supprimer ce message ?')) return;
    await api(`/admin/contacts/${id}`, { method: 'DELETE' });
    renderContacts();
  };

  /* ── PARTNERS ── */
  async function renderPartners() {
    const partners = await api('/partners');
    if (!partners) return;

    $('#content').innerHTML = `
      <div class="section-header">
        <h3>Partenaires</h3>
        <button class="btn btn-primary" onclick="addPartner()">+ Ajouter</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Image</th><th>Nom</th><th>Site</th><th>Ordre</th><th>Actions</th></tr></thead>
          <tbody>
            ${partners.map(p => `
              <tr>
                <td>${p.image ? `<img src="/${p.image}" class="table-thumb" alt="${esc(p.name)}"/>` : '<span class="material-symbols-outlined" style="opacity:0.3;font-size:1.5rem;">image</span>'}</td>
                <td style="font-weight:600;">${esc(p.name)}</td>
                <td>${p.website ? `<a href="${esc(p.website)}" target="_blank" style="color:var(--green-light);">Lien</a>` : '-'}</td>
                <td>${p.sort_order}</td>
                <td class="table-actions">
                  <button class="btn btn-outline btn-sm" onclick="editPartner(${p.id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deletePartner(${p.id})">Suppr</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  window.addPartner = async () => {
    openModal('Ajouter un partenaire', `
      <label>Nom</label>
      <input class="form-input" id="m-name" required/>
      ${imageUploadField('', 'm-image')}
      <label>Site web</label>
      <input class="form-input" id="m-website" placeholder="https://..."/>
      <label>Ordre</label>
      <input class="form-input" id="m-order" type="number" value="0"/>
    `, async () => {
      const image = await uploadIfSelected('m-image');
      await api('/partners', { method: 'POST', body: JSON.stringify({
        name: $('#m-name').value, image,
        website: $('#m-website').value, sort_order: Number($('#m-order').value)
      })});
      closeModal();
      renderPartners();
    });
    bindImagePreview('m-image');
  };

  window.editPartner = async (id) => {
    const p = await api(`/partners/${id}`);
    if (!p) return;
    openModal('Modifier le partenaire', `
      <label>Nom</label>
      <input class="form-input" id="m-name" value="${esc(p.name)}"/>
      ${imageUploadField(p.image || '', 'm-image')}
      <label>Site web</label>
      <input class="form-input" id="m-website" value="${esc(p.website || '')}"/>
      <label>Ordre</label>
      <input class="form-input" id="m-order" type="number" value="${p.sort_order}"/>
    `, async () => {
      const image = await uploadIfSelected('m-image');
      await api(`/partners/${id}`, { method: 'PUT', body: JSON.stringify({
        name: $('#m-name').value, image,
        website: $('#m-website').value, sort_order: Number($('#m-order').value)
      })});
      closeModal();
      renderPartners();
    });
    bindImagePreview('m-image');
  };

  window.deletePartner = async (id) => {
    if (!confirm('Supprimer ce partenaire ?')) return;
    await api(`/partners/${id}`, { method: 'DELETE' });
    renderPartners();
  };

  /* ── FAQ ── */
  async function renderFaq() {
    const faqs = await api('/faq');
    if (!faqs) return;

    $('#content').innerHTML = `
      <div class="section-header">
        <h3>Questions fréquentes</h3>
        <button class="btn btn-primary" onclick="addFaq()">+ Ajouter</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Question</th><th>Réponse</th><th>Icône</th><th>Ordre</th><th>Actions</th></tr></thead>
          <tbody>
            ${faqs.map(f => `
              <tr>
                <td style="font-weight:600;">${esc(f.question)}</td>
                <td>${esc(f.answer).substring(0, 60)}${f.answer.length > 60 ? '...' : ''}</td>
                <td><span class="material-symbols-outlined" style="font-size:1rem;">${f.icon}</span></td>
                <td>${f.sort_order}</td>
                <td class="table-actions">
                  <button class="btn btn-outline btn-sm" onclick="editFaq(${f.id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteFaq(${f.id})">Suppr</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  window.addFaq = async () => {
    openModal('Ajouter une FAQ', `
      <label>Icône</label>
      <input class="form-input" id="m-icon" value="help"/>
      <label>Question</label>
      <input class="form-input" id="m-question" required/>
      <label>Réponse</label>
      <input class="form-input" id="m-answer" required/>
      <label>Ordre</label>
      <input class="form-input" id="m-order" type="number" value="0"/>
    `, async () => {
      await api('/faq', { method: 'POST', body: JSON.stringify({
        icon: $('#m-icon').value, question: $('#m-question').value,
        answer: $('#m-answer').value, sort_order: Number($('#m-order').value)
      })});
      closeModal();
      renderFaq();
    });
  };

  window.editFaq = async (id) => {
    const f = await api(`/faq/${id}`);
    if (!f) return;
    openModal('Modifier la FAQ', `
      <label>Icône</label>
      <input class="form-input" id="m-icon" value="${esc(f.icon)}"/>
      <label>Question</label>
      <input class="form-input" id="m-question" value="${esc(f.question)}"/>
      <label>Réponse</label>
      <input class="form-input" id="m-answer" value="${esc(f.answer)}"/>
      <label>Ordre</label>
      <input class="form-input" id="m-order" type="number" value="${f.sort_order}"/>
    `, async () => {
      await api(`/faq/${id}`, { method: 'PUT', body: JSON.stringify({
        icon: $('#m-icon').value, question: $('#m-question').value,
        answer: $('#m-answer').value, sort_order: Number($('#m-order').value)
      })});
      closeModal();
      renderFaq();
    });
  };

  window.deleteFaq = async (id) => {
    if (!confirm('Supprimer cette FAQ ?')) return;
    await api(`/faq/${id}`, { method: 'DELETE' });
    renderFaq();
  };

  /* ── MODAL ── */
  function openModal(title, fieldsHTML, onSave) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <h3>${title}</h3>
        <div class="modal-form">${fieldsHTML}</div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="modal-cancel">Annuler</button>
          <button class="btn btn-primary" id="modal-save">Enregistrer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    overlay.querySelector('#modal-cancel').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    overlay.querySelector('#modal-save').addEventListener('click', onSave);
  }

  function closeModal() {
    const overlay = $('.modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 200);
    }
  }

  /* ── UTILS ── */
  function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.path;
  }

  function imageUploadField(currentImage = '', id = 'm-image') {
    const preview = currentImage ? `<img src="/${currentImage}" class="image-preview" alt="Aperçu"/>` : '';
    return `
      <label>Image</label>
      <div class="image-upload-area">
        <div class="image-preview-wrap" id="${id}-preview">${preview}</div>
        <input type="file" id="${id}-file" accept="image/*" class="image-input"/>
        <label for="${id}-file" class="image-upload-btn">
          <span class="material-symbols-outlined">upload</span> Choisir une image
        </label>
        <input type="hidden" id="${id}" value="${esc(currentImage)}"/>
      </div>
    `;
  }

  function bindImagePreview(id) {
    const fileInput = $(`#${id}-file`);
    const hiddenInput = $(`#${id}`);
    const previewWrap = $(`#${id}-preview`);
    if (!fileInput) return;
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewWrap.innerHTML = `<img src="${e.target.result}" class="image-preview" alt="Aperçu"/>`;
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadIfSelected(id) {
    const fileInput = $(`#${id}-file`);
    const hiddenInput = $(`#${id}`);
    if (fileInput && fileInput.files[0]) {
      const path = await uploadImage(fileInput.files[0]);
      if (path) hiddenInput.value = path;
    }
    return hiddenInput.value;
  }

  /* ── INIT ── */
  if (token && currentUser) {
    showDashboard();
  } else {
    showLogin();
  }
})();
