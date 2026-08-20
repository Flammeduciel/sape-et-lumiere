document.addEventListener('DOMContentLoaded', () => {

  AOS.init({
    duration: 1000,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100,
    disable: false
  });

  const API_BASE = '';
  let apiAvailable = true;

  async function apiFetch(path) {
    try {
      const res = await fetch(`${API_BASE}/api${path}`);
      if (!res.ok) throw new Error('API error');
      apiAvailable = true;
      return await res.json();
    } catch (err) {
      apiAvailable = false;
      return null;
    }
  }

  /* ═══════════════════════════════════════
     RENDER PROGRAMME
     ═══════════════════════════════════════ */

  async function renderProgramme() {
    const tabs = document.getElementById('programme-tabs');
    const content = document.getElementById('schedule-list');
    const img = document.getElementById('programme-img');
    if (!tabs || !content || !img) return;

    let days = FESTIVAL.dates.days;
    let programme = FESTIVAL.programme;

    const apiProgramme = await apiFetch('/programme');
    if (apiProgramme && apiProgramme.length) {
      programme = {};
      apiProgramme.forEach(e => {
        if (!programme[e.day]) programme[e.day] = [];
        programme[e.day].push({ time: e.time, title: e.title, icon: e.icon, desc: e.description });
      });
    }

    tabs.innerHTML = days.map((d, i) =>
      `<button class="programme-tab${i === 0 ? ' active' : ''}" data-day="${d.value}">${d.label}</button>`
    ).join('');

    img.src = days[0].image;

    function loadDay(day) {
      const events = programme[day] || [];
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

    loadDay(days[0].value);

    tabs.addEventListener('click', e => {
      const btn = e.target.closest('.programme-tab');
      if (!btn) return;
      tabs.querySelectorAll('.programme-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const dayData = days.find(d => d.value === btn.dataset.day);
      if (dayData) img.src = dayData.image;
      loadDay(btn.dataset.day);
    });
  }

  /* ═══════════════════════════════════════
     RENDER ARTISTS (LINE-UP)
     ═══════════════════════════════════════ */

  let allArtists = [];

  async function renderArtists() {
    const filters = document.getElementById('artist-filters');
    const grid = document.getElementById('artists-grid');
    if (!filters || !grid) return;

    const categories = FESTIVAL.categories;

    const apiArtists = await apiFetch('/artists');
    if (apiArtists && apiArtists.length) {
      allArtists = apiArtists.map(a => ({
        name: a.name,
        discipline: a.discipline,
        category: a.category,
        image: a.image,
        bio: a.bio,
        social: {
          ...(a.social_instagram && { instagram: a.social_instagram }),
          ...(a.social_youtube && { youtube: a.social_youtube }),
          ...(a.social_spotify && { spotify: a.social_spotify }),
          ...(a.social_website && { website: a.social_website }),
          ...(a.social_soundcloud && { soundcloud: a.social_soundcloud }),
          ...(a.social_mixcloud && { mixcloud: a.social_mixcloud }),
          ...(a.social_behance && { behance: a.social_behance }),
          ...(a.social_github && { github: a.social_github }),
        }
      }));
    } else {
      allArtists = FESTIVAL.artists;
    }

    filters.innerHTML = categories.map((c, i) =>
      `<button class="artist-filter${i === 0 ? ' active' : ''}" data-cat="${c.value}">${c.label}</button>`
    ).join('');

    function loadArtists(cat) {
      const list = cat === 'tous'
        ? allArtists
        : allArtists.filter(a => a.category === cat);

      grid.innerHTML = list.map(a => `
        <article class="artist-card" data-artist="${a.name}" tabindex="0" role="button" aria-label="Voir la fiche de ${a.name}">
          <div class="artist-card-img">
            <img src="${a.image}" alt="${a.name}"/>
          </div>
          <h4 class="artist-name">${a.name}</h4>
          <span class="artist-category">${categories.find(c => c.value === a.category)?.label || a.category}</span>
        </article>
      `).join('');

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

  async function renderBilletterie() {
    const grid = document.getElementById('tickets-grid');
    const featuresEl = document.getElementById('billetterie-features');
    if (!grid || !featuresEl) return;

    let tickets = FESTIVAL.billetterie.tickets;
    const waNumber = FESTIVAL.billetterie.whatsappNumber;
    const waMessage = FESTIVAL.billetterie.whatsappMessage;
    const features = FESTIVAL.billetterie.features;

    const apiTickets = await apiFetch('/tickets');
    if (apiTickets && apiTickets.length) {
      tickets = apiTickets.map(t => ({
        name: t.name,
        price: t.price,
        details: t.details,
        popular: !!t.popular
      }));
    }

    grid.innerHTML = tickets.map(t => {
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage(t.name))}`;
      return `
        <div class="card-ticket${t.popular ? ' popular' : ''}">
          <h3 class="ticket-title">${t.name}</h3>
          <span class="ticket-price ${t.popular ? 'red' : 'green'}">${t.price}</span>
          <p class="ticket-details">${t.details}</p>
          <a href="${waUrl}" target="_blank" rel="noopener" class="btn ${t.popular ? 'btn-whatsapp' : 'btn-black'}">RÉSERVER VIA WHATSAPP</a>
        </div>
      `;
    }).join('');

    featuresEl.innerHTML = features.map(f => `
      <div class="billetterie-feature">
        <span class="material-symbols-outlined billetterie-feature-icon">check</span>
        <span class="billetterie-feature-text">${f}</span>
      </div>
    `).join('');
  }

  /* ═══════════════════════════════════════
     RENDER INFOS PRATIQUES
     ═══════════════════════════════════════ */

  function renderPratique() {
    const grid = document.getElementById('pratique-grid');
    if (!grid) return;

    grid.innerHTML = FESTIVAL.pratique.items.map(item => `
      <div class="pratique-card">
        <span class="material-symbols-outlined pratique-icon">${item.icon}</span>
        <h3 class="pratique-label">${item.label}</h3>
        <p class="pratique-text">${item.text}</p>
      </div>
    `).join('');
  }

  /* ═══════════════════════════════════════
     RENDER PARTENAIRES
     ═══════════════════════════════════════ */

  async function renderPartenaires() {
    const grid = document.getElementById('partners-grid');
    if (!grid) return;

    let partners = FESTIVAL.partenaires;

    const apiPartners = await apiFetch('/partners');
    if (apiPartners && apiPartners.length) {
      partners = apiPartners.map(p => ({
        name: p.name,
        image: p.image
      }));
    }

    grid.innerHTML = partners.map(p => `
      <div class="partner-item" title="${p.name}">
        <img src="${p.image}" alt="Logo ${p.name}"/>
      </div>
    `).join('');
  }

  /* ═══════════════════════════════════════
     RENDER FAQ
     ═══════════════════════════════════════ */

  async function renderFaq() {
    const list = document.getElementById('faq-list');
    if (!list) return;

    let faqItems = FESTIVAL.faq;

    const apiFaq = await apiFetch('/faq');
    if (apiFaq && apiFaq.length) {
      faqItems = apiFaq.map(f => ({
        icon: f.icon,
        question: f.question,
        answer: f.answer
      }));
    }

    list.innerHTML = faqItems.map((q, i) => `
      <div class="faq-item" data-index="${i}">
        <div class="faq-item-row">
          <div class="faq-item-content">
            <span class="material-symbols-outlined faq-icon">${q.icon}</span>
            <span style="font-weight:500;font-size:var(--fs-label-md);">${q.question}</span>
          </div>
          <span class="faq-plus">+</span>
        </div>
        <div class="faq-answer">
          <p>${q.answer}</p>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        list.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-plus').textContent = '+';
        });
        if (!isOpen) {
          item.classList.add('active');
          item.querySelector('.faq-plus').textContent = '−';
        }
      });
    });
  }

  /* ═══════════════════════════════════════
     CONTACT FORM → API
     ═══════════════════════════════════════ */

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const phoneInput = document.getElementById('contact-phone');
    const messageInput = document.getElementById('contact-message');
    const errorName = document.getElementById('error-name');
    const errorPhone = document.getElementById('error-phone');
    const errorMessage = document.getElementById('error-message');
    const success = document.getElementById('form-success');

    function setError(el, msg) {
      el.textContent = msg;
      el.classList.toggle('visible', Boolean(msg));
    }

    function validateField(input, errorEl, rule) {
      const result = rule(input.value.trim());
      if (!result.valid) {
        setError(errorEl, result.message);
        input.classList.add('invalid');
        return false;
      }
      setError(errorEl, '');
      input.classList.remove('invalid');
      return true;
    }

    const isNotEmpty = value => value.length > 0
      ? { valid: true }
      : { valid: false, message: 'Ce champ est obligatoire.' };

    const isPhoneValid = value => {
      const cleaned = value.replace(/[\s.\-()]/g, '');
      const phoneOk = /^\+?\d{8,15}$/.test(cleaned);
      if (value.length === 0) return { valid: false, message: 'Ce champ est obligatoire.' };
      if (!phoneOk) return { valid: false, message: 'Numéro de téléphone invalide.' };
      return { valid: true };
    };

    const isMessageValid = value => {
      if (value.length === 0) return { valid: false, message: 'Ce champ est obligatoire.' };
      if (value.length < 10) return { valid: false, message: 'Votre message doit contenir au moins 10 caractères.' };
      return { valid: true };
    };

    nameInput.addEventListener('blur', () => validateField(nameInput, errorName, isNotEmpty));
    phoneInput.addEventListener('blur', () => validateField(phoneInput, errorPhone, isPhoneValid));
    messageInput.addEventListener('blur', () => validateField(messageInput, errorMessage, isMessageValid));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const okName = validateField(nameInput, errorName, isNotEmpty);
      const okPhone = validateField(phoneInput, errorPhone, isPhoneValid);
      const okMessage = validateField(messageInput, errorMessage, isMessageValid);

      if (okName && okPhone && okMessage) {
        try {
          const res = await fetch(`${API_BASE}/api/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: nameInput.value.trim(),
              phone: phoneInput.value.trim(),
              message: messageInput.value.trim()
            })
          });
          if (res.ok) {
            success.hidden = false;
            form.reset();
            [nameInput, phoneInput, messageInput].forEach(i => i.classList.remove('invalid'));
          } else {
            success.hidden = false;
            form.reset();
            [nameInput, phoneInput, messageInput].forEach(i => i.classList.remove('invalid'));
          }
        } catch (err) {
          success.hidden = false;
          form.reset();
          [nameInput, phoneInput, messageInput].forEach(i => i.classList.remove('invalid'));
        }
      }
    });
  }

  /* ═══════════════════════════════════════
     ARTIST MODAL
     ═══════════════════════════════════════ */

  const modalOverlay = document.getElementById('artist-modal-overlay');
  const modal = document.getElementById('artist-modal');
  const modalClose = document.getElementById('artist-modal-close');

  function openArtistModal(name) {
    const artist = allArtists.find(a => a.name === name);
    if (!artist) return;

    const catLabel = FESTIVAL.categories.find(c => c.value === artist.category)?.label || artist.category;

    document.getElementById('artist-modal-img').style.backgroundImage = `url(${artist.image})`;
    document.getElementById('artist-modal-category').textContent = catLabel;
    document.getElementById('artist-modal-title').textContent = artist.name;
    document.getElementById('artist-modal-discipline').textContent = artist.discipline;
    document.getElementById('artist-modal-bio').textContent = artist.bio;

    const socialEl = document.getElementById('artist-modal-social');
    if (artist.social && Object.keys(artist.social).length) {
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
     NAV + DRAWER (MENU MOBILE)
     ═══════════════════════════════════════ */

  function initNav() {
    const hamburger = document.getElementById('hamburger-btn');
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');

    if (!hamburger || !drawer || !overlay || !drawerClose) return;

    function openDrawer() {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    drawer.querySelectorAll('.drawer-links a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

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
  renderPratique();
  renderPartenaires();
  renderFaq();
  initContactForm();
  initHeroButtons();
  initNav();

});
