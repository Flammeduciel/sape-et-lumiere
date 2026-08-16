document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════
     RENDER PROGRAMME
     ═══════════════════════════════════════ */

  function renderProgramme() {
    const tabs = document.getElementById('programme-tabs');
    const content = document.getElementById('schedule-list');
    const img = document.getElementById('programme-img');

    if (!tabs || !content || !img) return;

    tabs.innerHTML = FESTIVAL.dates.days.map((d, i) =>
      `<button class="programme-tab${i === 0 ? ' active' : ''}" data-day="${d.value}">${d.label}</button>`
    ).join('');

    img.src = FESTIVAL.dates.days[0].image;

    function loadDay(day) {
      const events = FESTIVAL.programme[day];
      content.innerHTML = events.map(e => `
        <div class="schedule-item">
          <div class="schedule-icon">
            <span class="material-symbols-outlined">${e.icon}</span>
          </div>
          <div class="schedule-info">
            <span class="schedule-time">${e.time}</span>
            <h4 class="schedule-title">${e.title}</h4>
            <p class="schedule-desc">${e.desc}</p>
          </div>
        </div>
      `).join('');
    }

    loadDay(FESTIVAL.dates.days[0].value);

    tabs.addEventListener('click', e => {
      const btn = e.target.closest('.programme-tab');
      if (!btn) return;
      tabs.querySelectorAll('.programme-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const dayData = FESTIVAL.dates.days.find(d => d.value === btn.dataset.day);
      if (dayData) img.src = dayData.image;
      loadDay(btn.dataset.day);
    });
  }

  /* ═══════════════════════════════════════
     RENDER ARTISTS (LINE-UP)
     ═══════════════════════════════════════ */

  function renderArtists() {
    const filters = document.getElementById('artist-filters');
    const grid = document.getElementById('artists-grid');

    if (!filters || !grid) return;

    filters.innerHTML = FESTIVAL.categories.map((c, i) =>
      `<button class="artist-filter${i === 0 ? ' active' : ''}" data-cat="${c.value}">${c.label}</button>`
    ).join('');

    function loadArtists(cat) {
      const list = cat === 'tous'
        ? FESTIVAL.artists
        : FESTIVAL.artists.filter(a => a.category === cat);

      grid.innerHTML = list.map(a => `
        <article class="artist-card" data-artist="${a.name}" tabindex="0" role="button" aria-label="Voir la fiche de ${a.name}">
          <div class="artist-card-img">
            <img src="${a.image}" alt="${a.name}"/>
          </div>
          <h4 class="artist-name">${a.name}</h4>
          <span class="artist-category">${FESTIVAL.categories.find(c => c.value === a.category)?.label || a.category}</span>
        </article>
      `).join('');

      // Click/Enter sur carte → ouvrir modal
      grid.querySelectorAll('.artist-card').forEach(card => {
        card.addEventListener('click', () => openArtistModal(card.dataset.artist));
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openArtistModal(card.dataset.artist); });
      });
    }

    loadArtists('tous');

    filters.addEventListener('click', e => {
      const btn = e.target.closest('.artist-filter');
      if (!btn) return;
      filters.querySelectorAll('.artist-filter').forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      loadArtists(btn.dataset.cat);
    });
  }

  /* ═══════════════════════════════════════
     RENDER BILLETTERIE
     ═══════════════════════════════════════ */

  function renderBilletterie() {
    const grid = document.getElementById('tickets-grid');
    const featuresEl = document.getElementById('billetterie-features');
    if (!grid || !featuresEl) return;

    grid.innerHTML = FESTIVAL.billetterie.tickets.map(t => {
      const waUrl = `https://wa.me/${FESTIVAL.billetterie.whatsappNumber}?text=${encodeURIComponent(FESTIVAL.billetterie.whatsappMessage(t.name))}`;
      return `
        <div class="card-ticket${t.popular ? ' popular' : ''}">
          <h3 class="ticket-title">${t.name}</h3>
          <span class="ticket-price ${t.popular ? 'red' : 'green'}">${t.price}</span>
          <p class="ticket-details">${t.details}</p>
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn ${t.popular ? 'btn-whatsapp' : 'btn-black'}">RÉSERVER VIA WHATSAPP</a>
        </div>
      `;
    }).join('');

    featuresEl.innerHTML = FESTIVAL.billetterie.features.map(f => `
      <div class="billetterie-feature">
        <span class="material-symbols-outlined billetterie-feature-icon">check</span>
        <span class="billetterie-feature-text">${f}</span>
      </div>
    `).join('');
  }

  /* ═══════════════════════════════════════
     ARTIST MODAL
     ═══════════════════════════════════════ */

  const modalOverlay = document.getElementById('artist-modal-overlay');
  const modal = document.getElementById('artist-modal');
  const modalClose = document.getElementById('artist-modal-close');

  function openArtistModal(name) {
    const artist = FESTIVAL.artists.find(a => a.name === name);
    if (!artist) return;

    const catLabel = FESTIVAL.categories.find(c => c.value === artist.category)?.label || artist.category;

    document.getElementById('artist-modal-img').style.backgroundImage = `url(${artist.image})`;
    document.getElementById('artist-modal-category').textContent = catLabel;
    document.getElementById('artist-modal-title').textContent = artist.name;
    document.getElementById('artist-modal-discipline').textContent = artist.discipline;
    document.getElementById('artist-modal-bio').textContent = artist.bio;

    // Social links
    const socialEl = document.getElementById('artist-modal-social');
    if (artist.social) {
      socialEl.innerHTML = Object.entries(artist.social).map(([platform, url]) =>
        `<a href="${url}" target="_blank" rel="noopener" class="artist-social-link" aria-label="${platform}">
          <span class="material-symbols-outlined">${getSocialIcon(platform)}</span>
        </a>`
      ).join('');
    } else {
      socialEl.innerHTML = '';
    }

    modal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeArtistModal() {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function getSocialIcon(platform) {
    const icons = {
      instagram: 'photo_camera',
      youtube: 'play_circle',
      spotify: 'music_note',
      soundcloud: 'cloud',
      mixcloud: 'cloud',
      website: 'language',
      behance: 'palette',
      github: 'code',
      linkedin: 'badge'
    };
    return icons[platform] || 'link';
  }

  modalClose.addEventListener('click', closeArtistModal);
  modalOverlay.addEventListener('click', closeArtistModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) closeArtistModal(); });

  /* ═══════════════════════════════════════
     COUNTDOWN
     ═══════════════════════════════════════ */

  function updateCountdown() {
    const target = new Date(FESTIVAL.dates.opening).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      clearInterval(countdownInterval);
      showStartedLabel();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
  }

  function showStartedLabel() {
    const inner = document.querySelector('.countdown-inner');
    if (inner) {
      inner.innerHTML = `<span class="countdown-finished">${FESTIVAL.dates.startedLabel}</span>`;
    }
  }

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  /* ═══════════════════════════════════════
     HERO CTA BUTTONS
     ═══════════════════════════════════════ */

  function initHeroButtons() {
    const btnProgramme = document.getElementById('hero-btn-programme');
    const btnWhatsapp = document.getElementById('hero-btn-whatsapp');
    if (!btnProgramme || !btnWhatsapp) return;

    btnProgramme.addEventListener('click', () => {
      document.getElementById('programme').scrollIntoView({ behavior: 'smooth' });
    });

    btnWhatsapp.addEventListener('click', () => {
      const msg = FESTIVAL.billetterie.whatsappMessage("Pass");
      const url = `https://wa.me/${FESTIVAL.billetterie.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }

  /* ═══════════════════════════════════════
     INIT
     ═══════════════════════════════════════ */

  renderProgramme();
  renderArtists();
  renderBilletterie();
  initHeroButtons();

});