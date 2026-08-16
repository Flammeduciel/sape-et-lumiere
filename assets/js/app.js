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
        <div class="artist-card">
          <div class="artist-card-img">
            <img src="${a.image}" alt="${a.name}"/>
          </div>
          <h4 class="artist-name">${a.name}</h4>
          <span class="artist-category">${FESTIVAL.categories.find(c => c.value === a.category)?.label || a.category}</span>
        </div>
      `).join('');
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
     INIT
     ═══════════════════════════════════════ */

  renderProgramme();
  renderArtists();

});