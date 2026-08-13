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

});