/* ─────────────────────────────────────────────
   PORTFOLIO — Main JS
   Domenico Punzo
───────────────────────────────────────────── */

/* ── Page Load Fade-in ── */
document.body.style.opacity = '0';
requestAnimationFrame(() => {
  document.body.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1)';
  document.body.style.opacity = '1';
});

/* ── Nav scroll behavior ── */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile nav ── */
(function initMobileNav() {
  const burger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!burger || !mobileNav) return;
  let open = false;
  const toggle = () => {
    open = !open;
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const bars = burger.querySelectorAll('span');
    if (open) {
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  };
  burger.addEventListener('click', toggle);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', toggle));
})();

/* ── Scroll reveal ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ── Hero Typewriter ── */
(function initHeroTypewriter() {
  const first = document.getElementById('heroFirst');
  const last  = document.getElementById('heroLast');
  if (!first) return;

  const fn = first.dataset.text || '';
  const ln = last ? (last.dataset.text || '') : '';
  first.textContent = '';
  if (last) last.textContent = '';

  function typeStr(el, text, cb) {
    let i = 0;
    const iv = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(iv); cb && setTimeout(cb, 220); }
    }, 75);
  }

  setTimeout(() => {
    typeStr(first, fn, () => {
      if (last) typeStr(last, ln);
    });
  }, 550);
})();

/* ── Skills Accordion (legacy) ── */
(function initSkills() {
  const items = document.querySelectorAll('.skill-item');
  if (!items.length) return;
  items.forEach(item => {
    const header = item.querySelector('.skill-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── Skills Track (new design) — hover to expand ── */
(function initSkillsTrack() {
  const items = document.querySelectorAll('.skill-track-item');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  const track = document.querySelector('.skills-track');
  if (track) {
    /* When mouse leaves the track, restore first item */
    track.addEventListener('mouseleave', () => {
      items.forEach(i => i.classList.remove('active'));
      if (items[0]) items[0].classList.add('active');
    });

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { track.classList.add('in-view'); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(track);
  }
})();

/* ── Tools infinite ticker ── */
(function initTicker() {
  const track = document.querySelector('.tools-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
})();

/* ── Project Filters ── */
(function initFilters() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!btns.length || !cards.length) return;

  const applyFilters = () => {
    const yearBtn  = document.querySelector('.filter-btn[data-group="year"].active');
    const skillBtn = document.querySelector('.filter-btn[data-group="skill"].active');
    const yearVal  = yearBtn  ? yearBtn.dataset.value  : 'all';
    const skillVal = skillBtn ? skillBtn.dataset.value : 'all';

    cards.forEach(card => {
      const year  = card.dataset.year  || '';
      const skill = card.dataset.skill || '';
      const match = (yearVal  === 'all' || year  === yearVal) &&
                    (skillVal === 'all' || skill.split(',').includes(skillVal));
      if (match) {
        const wasHidden = card.classList.contains('card-out');
        card.classList.remove('card-out');
        card.style.pointerEvents = '';
        if (wasHidden) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.97)';
          card.style.transition = 'none';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '';
              card.style.transform = '';
            });
          });
        } else {
          card.style.opacity = '';
          card.style.transform = '';
        }
      } else {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.transition = 'none';
        card.style.pointerEvents = 'none';
        card.classList.add('card-out');
      }
    });
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
})();

/* ── Modal system ── */
(function initModals() {
  const backdrop = document.getElementById('modalBackdrop');
  if (!backdrop) return;
  const modal = backdrop.querySelector('.modal');

  const triggers   = Array.from(document.querySelectorAll('[data-modal]'));
  let   currentIdx = -1;

  const close = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openByIdx = (idx) => {
    if (idx < 0 || idx >= triggers.length) return;
    currentIdx = idx;
    const id   = triggers[idx].dataset.modal;
    const data = window.PROJECTS && window.PROJECTS[id];
    if (!data) return;
    renderModal(data);
    modal.scrollTop = 0;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  triggers.forEach((trigger, idx) => {
    trigger.addEventListener('click', () => openByIdx(idx));
  });

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop || e.target.closest('.modal-close-btn')) { close(); return; }
    if (e.target.closest('#modalPrev')) { openByIdx(currentIdx - 1); return; }
    if (e.target.closest('#modalNext')) { openByIdx(currentIdx + 1); return; }
    const thumb = e.target.closest('.modal-gallery-thumb');
    if (thumb) {
      const main = document.getElementById('modalMainImg');
      if (main) main.src = thumb.dataset.src;
      document.querySelectorAll('.modal-gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    }
  });
  document.addEventListener('keydown', e => {
    if (!backdrop.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  openByIdx(currentIdx - 1);
    if (e.key === 'ArrowRight') openByIdx(currentIdx + 1);
  });

  function renderModal(d) {
    const tools    = (d.tools || []).map(t => `<span class="skill-tool-badge">${t}</span>`).join('');
    const acBadges = (d.ac   || []).map(a => `<div class="ac-badge">${a.code}<div class="ac-tooltip"><div class="ac-tooltip-code">${a.code}</div><div class="ac-tooltip-title">${a.title}</div><div class="ac-tooltip-desc">${a.desc}</div></div></div>`).join('');
    const demarche = [d.context, d.methodology].filter(Boolean).map(p => `<p class="body">${p}</p>`).join('');
    const learned  = d.reflection?.learned || '';

    const topSection = d.video
      ? `<div class="modal-video-wrap">
           <video src="${d.video}" controls class="modal-video" preload="metadata" playsinline></video>
         </div>`
      : d.pdf
      ? `<div class="modal-pdf-top">
           <div class="modal-pdf-wrap"><iframe src="${d.pdf}#view=Fit" class="modal-pdf-iframe" loading="lazy" title="Document PDF"></iframe></div>
           <a href="${d.pdf}" target="_blank" class="modal-pdf-mobile-btn">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
             Ouvrir le PDF
           </a>
           <a href="${d.pdf}" target="_blank" class="btn btn-ghost modal-pdf-dl">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
             Ouvrir en plein écran
           </a>
         </div>`
      : d.gallery?.length
      ? `<div class="modal-gallery">
           <div class="modal-gallery-main">
             <img id="modalMainImg" src="${d.gallery[0]}" alt="${d.title}" loading="lazy" />
           </div>
           ${d.gallery.length > 1 ? `<div class="modal-gallery-thumbs">
             ${d.gallery.map((img, i) => `<div class="modal-gallery-thumb${i===0?' active':''}" data-src="${img}"><img src="${img}" alt="" loading="lazy"/></div>`).join('')}
           </div>` : ''}
         </div>`
      : `<div class="modal-hero-emoji">${d.emoji || '📁'}</div>`;

    const navPrevDisabled = currentIdx <= 0 ? ' disabled' : '';
    const navNextDisabled = currentIdx >= triggers.length - 1 ? ' disabled' : '';

    modal.innerHTML = `
      <div class="modal-close">
        <button class="modal-close-btn" aria-label="Fermer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      ${topSection}
      <div class="modal-body">
        <div class="modal-meta">
          <span class="modal-category">${d.category || ''}</span>
          ${d.year ? `<span class="tag">${d.year}</span>` : ''}
        </div>
        <h2 class="modal-title">${d.title}</h2>
        <p class="modal-desc">${d.description}</p>
        ${demarche  ? `<div class="modal-section"><h4>Démarche</h4>${demarche}</div>` : ''}
        ${d.results ? `<div class="modal-section"><h4>Résultats</h4><p class="body">${d.results}</p></div>` : ''}
        ${learned   ? `<div class="modal-section"><h4>Ce que j'ai retenu</h4><p class="body">${learned}</p></div>` : ''}
        ${acBadges  ? `<div class="modal-section"><h4>Apprentissages Critiques</h4><div class="ac-list">${acBadges}</div></div>` : ''}
        ${tools     ? `<div class="modal-section"><h4>Outils utilisés</h4><div class="skill-tool-badges">${tools}</div></div>` : ''}
        ${d.link    ? `<div class="modal-section"><a href="${d.link}" target="_blank" class="btn btn-ghost">Voir le projet ↗</a></div>` : ''}
      </div>
      <div class="modal-nav">
        <button class="modal-nav-btn" id="modalPrev"${navPrevDisabled}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Précédent
        </button>
        <button class="modal-nav-btn" id="modalNext"${navNextDisabled}>
          Suivant
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>`;
  }
})();


/* ── Contact form ── */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Message envoyé ✓';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; form.reset(); }, 3500);
  });
})();

/* ── Particle network background ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;
  const N = 65, LINK = 140;
  const particles = [];

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  class P {
    constructor() {
      this.x  = Math.random() * w;
      this.y  = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.2 + 0.4;
    }
    step() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(85,125,209,0.55)';
      ctx.fill();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < N; i++) {
      particles[i].step();
      particles[i].draw();
      for (let j = i + 1; j < N; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(85,125,209,${0.13 * (1 - d / LINK)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < N; i++) particles.push(new P());
  loop();
})();


/* ── Magnetic Buttons ── */
(function initMagnetic() {
  const isMobile = window.matchMedia('(hover: none)').matches;
  if (isMobile) return;

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width  / 2;
      const y  = e.clientY - r.top  - r.height / 2;
      btn.style.transition = 'transform 0.1s';
      btn.style.transform  = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.55s var(--ease-bounce)';
      btn.style.transform  = '';
    });
  });
})();

/* ── Count-up ── */
(function initCountUp() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el     = en.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let startTs  = null;
      const DUR    = 1400;
      (function tick(ts) {
        if (!startTs) startTs = ts;
        const p = Math.min((ts - startTs) / DUR, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  els.forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════
   UPGRADE — Mix A + B + C
══════════════════════════════════════ */

/* ── (B) Scroll progress bar ── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── (C) Cursor "VIEW" label on project cards ── */
(function initCursorProjectLabel() {
  if (window.matchMedia('(hover: none)').matches) return;
  const label = document.createElement('div');
  label.className = 'cursor-label';
  label.textContent = 'VIEW';
  document.body.appendChild(label);
  document.addEventListener('mousemove', e => {
    label.style.left = e.clientX + 'px';
    label.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => document.body.classList.add('cursor-project'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-project'));
  });
})();

/* ── (A) Section decorative numbers ── */
(function initSectionNums() {
  document.querySelectorAll('.section-header').forEach((header, i) => {
    const num = document.createElement('span');
    num.className = 'section-num';
    num.setAttribute('aria-hidden', 'true');
    num.textContent = String(i + 1).padStart(2, '0');
    header.insertBefore(num, header.firstChild);
  });
})();

/* ── Language / i18n ── */
(function initLang() {
  const T = {
    fr: {
      nav_about: 'À propos', nav_projects: 'Projets', nav_skills: 'Compétences', nav_contact: 'Contact',
      nav_switch_acad: 'Portfolio Académique →', nav_switch_pro: 'Portfolio Pro →',
      index_sub: 'Qui êtes-vous ?',
      index_pro_eyebrow: 'Portfolio professionnel', index_pro_title: 'Je suis un<br>recruteur',
      index_pro_desc: 'Projets clients, compétences et réalisations concrètes.',
      index_acad_eyebrow: 'Portfolio académique', index_acad_title: 'Je suis un<br>enseignant',
      index_acad_desc: 'SAÉ, compétences BUT et progression académique.',
      index_explore: 'Explorer',
      index_hint: 'Sélectionnez votre profil pour accéder au portfolio correspondant',
      pro_role: 'Design · Création numérique · Communication visuelle',
      pro_tagline: 'Je conçois des expériences visuelles et numériques percutantes : design graphique, développement web, vidéo et motion.',
      cta_projects: 'Voir mes projets', cta_contact: 'Me contacter',
      stat_years: 'Années de BUT MMI', stat_projects: 'Projets réalisés', stat_skills: 'Compétences clés',
      about_label: 'À propos', about_headline: 'Qui suis-je ?',
      location_label: 'Localisation', status_label: 'Statut', status_value: 'Disponible', status_sub: 'Stage / Alternance',
      bio_label: 'Bio',
      proj_label: 'Réalisations', pro_proj_headline: 'Projets professionnels',
      pro_proj_sub: 'Design, web et création multimédia : des réalisations concrètes.',
      filter_all: 'Tous', filter_comm: 'Communication', filter_crea: 'Création', filter_video: 'Vidéo',
      skills_label: 'Expertise', skills_headline: 'Compétences clés',
      skills_sub: 'Design, développement et création multimédia.', tools_label: 'Outils maîtrisés',
      contact_label: 'Contact', pro_contact_headline: 'Travaillons ensemble',
      pro_contact_sub: 'Une mission, un stage, une alternance ? Parlons-en.',
      pro_contact_role: 'Étudiant BUT MMI · Multimédia & Création numérique',
      pro_avail: 'Disponible · Alternance / Stage', cv_dl: 'Télécharger mon CV',
      form_submit_pro: 'Envoyer le message',
      acad_badge: 'Portfolio Académique', acad_but: 'BUT MMI',
      acad_tagline: "Chaque SAÉ a été une occasion d'apprendre, d'itérer et de progresser. Ce portfolio documente honnêtement ce parcours, des premiers projets web aux créations multimédia avancées.",
      acad_cta_proj: 'Voir les projets BUT', acad_cta_pro: 'Portfolio Pro',
      acad_about_label: 'Mon parcours', acad_about_headline: '2 ans de BUT MMI',
      acad_stat1: 'Années de BUT', acad_stat2: 'SAÉ réalisées', acad_stat3: 'Compétences BUT',
      timeline_label: 'Parcours', timeline_headline: 'Ma formation',
      acad_proj_label: 'SAÉ & Projets tutorés', acad_proj_headline: 'Projets académiques',
      acad_proj_sub: 'Filtrez par année ou par compétence mobilisée.',
      filter_all_year: 'Toutes les années', filter_but1: 'BUT 1', filter_but2: 'BUT 2',
      filter_all_proj: 'Tous les projets', filter_dev: 'Développement',
      acad_tools_label: 'Outils utilisés en BUT',
      acad_contact_headline: 'Une question sur mon parcours ?',
      acad_contact_sub: 'Enseignants, jury, recruteurs : je suis disponible pour en discuter.',
      acad_contact_role: 'Étudiant BUT MMI · Multimédia & Internet',
      acad_avail: 'Disponible · Échanges & Opportunités', acad_pro_link: 'Portfolio Professionnel',
      form_submit_acad: 'Envoyer',
    },
    en: {
      nav_about: 'About', nav_projects: 'Projects', nav_skills: 'Skills', nav_contact: 'Contact',
      nav_switch_acad: 'Academic Portfolio →', nav_switch_pro: 'Pro Portfolio →',
      index_sub: 'Who are you?',
      index_pro_eyebrow: 'Professional Portfolio', index_pro_title: "I'm a<br>recruiter",
      index_pro_desc: 'Client projects, skills and concrete achievements.',
      index_acad_eyebrow: 'Academic Portfolio', index_acad_title: "I'm a<br>teacher",
      index_acad_desc: 'SAÉ projects, BUT skills and academic progression.',
      index_explore: 'Explore',
      index_hint: 'Select your profile to access the corresponding portfolio',
      pro_role: 'Design · Digital Creation · Visual Communication',
      pro_tagline: 'I create impactful visual and digital experiences: graphic design, web development, video and motion design.',
      cta_projects: 'See my projects', cta_contact: 'Contact me',
      stat_years: 'Years of BUT MMI', stat_projects: 'Projects completed', stat_skills: 'Key skills',
      about_label: 'About', about_headline: 'Who am I?',
      location_label: 'Location', status_label: 'Status', status_value: 'Available', status_sub: 'Internship / Work-study',
      bio_label: 'Bio',
      proj_label: 'Work', pro_proj_headline: 'Professional Projects',
      pro_proj_sub: 'Design, web and multimedia creation: concrete achievements.',
      filter_all: 'All', filter_comm: 'Communication', filter_crea: 'Creation', filter_video: 'Video',
      skills_label: 'Expertise', skills_headline: 'Key skills',
      skills_sub: 'Design, development and multimedia creation.', tools_label: 'Tools',
      contact_label: 'Contact', pro_contact_headline: "Let's work together",
      pro_contact_sub: "A project, internship, work-study? Let's talk.",
      pro_contact_role: 'BUT MMI Student · Multimedia & Digital Creation',
      pro_avail: 'Available · Work-study / Internship', cv_dl: 'Download my CV',
      form_submit_pro: 'Send message',
      acad_badge: 'Academic Portfolio', acad_but: 'BUT MMI',
      acad_tagline: 'Each SAÉ was an opportunity to learn, iterate and progress. This portfolio honestly documents this journey, from early web projects to advanced multimedia creations.',
      acad_cta_proj: 'See BUT projects', acad_cta_pro: 'Pro Portfolio',
      acad_about_label: 'My journey', acad_about_headline: '2 Years of BUT MMI',
      acad_stat1: 'Years of BUT', acad_stat2: 'SAÉ completed', acad_stat3: 'BUT skills',
      timeline_label: 'Journey', timeline_headline: 'My education',
      acad_proj_label: 'SAÉ & Tutored Projects', acad_proj_headline: 'Academic Projects',
      acad_proj_sub: 'Filter by year or skill.',
      filter_all_year: 'All years', filter_but1: 'Year 1', filter_but2: 'Year 2',
      filter_all_proj: 'All projects', filter_dev: 'Development',
      acad_tools_label: 'Tools used in BUT',
      acad_contact_headline: 'A question about my journey?',
      acad_contact_sub: "Teachers, jury, recruiters: I'm available to discuss.",
      acad_contact_role: 'BUT MMI Student · Multimedia & Internet',
      acad_avail: 'Available · Exchanges & Opportunities', acad_pro_link: 'Professional Portfolio',
      form_submit_acad: 'Send',
    },
    it: {
      nav_about: 'Chi sono', nav_projects: 'Progetti', nav_skills: 'Competenze', nav_contact: 'Contatto',
      nav_switch_acad: 'Portfolio Accademico →', nav_switch_pro: 'Portfolio Professionale →',
      index_sub: 'Chi sei?',
      index_pro_eyebrow: 'Portfolio professionale', index_pro_title: 'Sono un<br>recruiter',
      index_pro_desc: 'Progetti clienti, competenze e risultati concreti.',
      index_acad_eyebrow: 'Portfolio accademico', index_acad_title: 'Sono un<br>insegnante',
      index_acad_desc: 'SAÉ, competenze BUT e progressione accademica.',
      index_explore: 'Esplora',
      index_hint: 'Seleziona il tuo profilo per accedere al portfolio corrispondente',
      pro_role: 'Design · Creazione digitale · Comunicazione visiva',
      pro_tagline: "Creo esperienze visive e digitali d'impatto: design grafico, sviluppo web, video e motion design.",
      cta_projects: 'I miei progetti', cta_contact: 'Contattami',
      stat_years: 'Anni di BUT MMI', stat_projects: 'Progetti realizzati', stat_skills: 'Competenze chiave',
      about_label: 'Chi sono', about_headline: 'Chi sono?',
      location_label: 'Posizione', status_label: 'Stato', status_value: 'Disponibile', status_sub: 'Stage / Alternanza',
      bio_label: 'Bio',
      proj_label: 'Lavori', pro_proj_headline: 'Progetti professionali',
      pro_proj_sub: 'Design, web e creazione multimediale: risultati concreti.',
      filter_all: 'Tutti', filter_comm: 'Comunicazione', filter_crea: 'Creazione', filter_video: 'Video',
      skills_label: 'Expertise', skills_headline: 'Competenze chiave',
      skills_sub: 'Design, sviluppo e creazione multimediale.', tools_label: 'Strumenti',
      contact_label: 'Contatto', pro_contact_headline: 'Lavoriamo insieme',
      pro_contact_sub: 'Un progetto, stage, alternanza? Parliamone.',
      pro_contact_role: 'Studente BUT MMI · Multimedia e Creazione digitale',
      pro_avail: 'Disponibile · Alternanza / Stage', cv_dl: 'Scarica il mio CV',
      form_submit_pro: 'Invia messaggio',
      acad_badge: 'Portfolio Accademico', acad_but: 'BUT MMI',
      acad_tagline: "Ogni SAÉ è stata un'occasione per imparare, iterare e progredire. Questo portfolio documenta onestamente questo percorso, dai primi progetti web alle creazioni multimediali avanzate.",
      acad_cta_proj: 'Guarda i progetti BUT', acad_cta_pro: 'Portfolio Pro',
      acad_about_label: 'Il mio percorso', acad_about_headline: '2 anni di BUT MMI',
      acad_stat1: 'Anni di BUT', acad_stat2: 'SAÉ realizzate', acad_stat3: 'Competenze BUT',
      timeline_label: 'Percorso', timeline_headline: 'La mia formazione',
      acad_proj_label: 'SAÉ & Progetti tutoriali', acad_proj_headline: 'Progetti accademici',
      acad_proj_sub: 'Filtra per anno o competenza.',
      filter_all_year: 'Tutti gli anni', filter_but1: 'Anno 1', filter_but2: 'Anno 2',
      filter_all_proj: 'Tutti i progetti', filter_dev: 'Sviluppo',
      acad_tools_label: 'Strumenti usati in BUT',
      acad_contact_headline: 'Una domanda sul mio percorso?',
      acad_contact_sub: 'Insegnanti, giuria, recruiter: sono disponibile per discuterne.',
      acad_contact_role: 'Studente BUT MMI · Multimedia e Internet',
      acad_avail: 'Disponibile · Scambi & Opportunità', acad_pro_link: 'Portfolio Professionale',
      form_submit_acad: 'Invia',
    }
  };

  function applyLang(lang) {
    if (!T[lang]) lang = 'fr';
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    const t = T[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key] === undefined) return;
      if (el.dataset.i18nHtml !== undefined) {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  const saved = localStorage.getItem('lang') || 'fr';
  applyLang(saved);

  document.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (btn && btn.dataset.lang) applyLang(btn.dataset.lang);
  });
})();

/* ── (C) Headline word-slide reveal ── */
(function initHeadlineReveal() {
  document.querySelectorAll('.section-header .headline').forEach(el => {
    el.classList.remove('reveal', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3');
    el.style.cssText = 'opacity:1;transform:none;';
    el.innerHTML = el.textContent.trim().split(' ').map((w, i) =>
      `<span class="hw-wrap"><span class="hw" style="transition-delay:${i * 65}ms">${w}</span></span>`
    ).join(' ');
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.querySelectorAll('.hw').forEach(hw => hw.classList.add('hw-in'));
    }, { threshold: 0.25 }).observe(el);
  });
})();
