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

/* ── Custom Cursor ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function tick() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();
})();

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

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const yearActive  = document.querySelector('.filter-btn[data-group="year"].active')?.dataset.value  || 'all';
      const skillActive = document.querySelector('.filter-btn[data-group="skill"].active')?.dataset.value || 'all';

      cards.forEach(card => {
        const year  = card.dataset.year  || 'all';
        const skill = card.dataset.skill || 'all';
        const matchY = yearActive  === 'all' || year  === yearActive;
        const matchS = skillActive === 'all' || skill.split(',').includes(skillActive);
        card.style.opacity    = matchY && matchS ? '1' : '0.2';
        card.style.transform  = matchY && matchS ? '' : 'scale(0.96)';
        card.style.pointerEvents = matchY && matchS ? '' : 'none';
        card.style.transition = 'opacity 0.35s, transform 0.35s';
      });
    });
  });
})();

/* ── Modal system ── */
(function initModals() {
  const backdrop = document.getElementById('modalBackdrop');
  if (!backdrop) return;
  const modal = backdrop.querySelector('.modal');

  const close = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id   = trigger.dataset.modal;
      const data = window.PROJECTS && window.PROJECTS[id];
      if (!data) return;
      renderModal(data);
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop || e.target.closest('.modal-close-btn')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  function renderModal(d) {
    const gallery = d.images?.length
      ? `<div class="modal-gallery">
          <div class="modal-gallery-main">
            <img id="modalMainImg" src="${d.images[0]}" alt="${d.title}" loading="lazy" />
          </div>
          ${d.images.length > 1 ? `<div class="modal-gallery-thumbs">
            ${d.images.map((img, i) => `<div class="modal-gallery-thumb${i===0?' active':''}" onclick="setModalImg('${img}',this)"><img src="${img}" alt="" loading="lazy"/></div>`).join('')}
          </div>` : ''}
        </div>`
      : `<div class="modal-hero-emoji">${d.emoji || '📁'}</div>`;

    const tools     = (d.tools || []).map(t => `<span class="skill-tool-badge">${t}</span>`).join('');
    const acBadges  = (d.ac   || []).map(a => `<div class="ac-badge">${a.code}<div class="ac-tooltip"><div class="ac-tooltip-code">${a.code}</div><div class="ac-tooltip-title">${a.title}</div><div class="ac-tooltip-desc">${a.desc}</div></div></div>`).join('');
    const demarche  = [d.context, d.methodology].filter(Boolean).join(' — ');
    const learned   = d.reflection?.learned || '';

    modal.innerHTML = `
      <div class="modal-close">
        <button class="modal-close-btn" aria-label="Fermer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      ${gallery}
      <div class="modal-body">
        <div class="modal-meta">
          <span class="modal-category">${d.category || ''}</span>
          ${d.year ? `<span class="tag">${d.year}</span>` : ''}
        </div>
        <h2 class="modal-title">${d.title}</h2>
        <p class="modal-desc">${d.description}</p>
        ${demarche  ? `<div class="modal-section"><h4>Démarche</h4><p class="body">${demarche}</p></div>` : ''}
        ${d.results ? `<div class="modal-section"><h4>Résultats</h4><p class="body">${d.results}</p></div>` : ''}
        ${d.pdf ? `<div class="modal-section modal-pdf-section">
          <h4>Document de projet</h4>
          <div class="modal-pdf-wrap">
            <iframe src="${d.pdf}" class="modal-pdf-iframe" loading="lazy" title="Document PDF"></iframe>
          </div>
          <a href="${d.pdf}" target="_blank" class="btn btn-ghost modal-pdf-dl">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Ouvrir en plein écran
          </a>
        </div>` : ''}
        ${learned ? `<div class="modal-section"><h4>Ce que j'ai retenu</h4><p class="body">${learned}</p></div>` : ''}
        ${acBadges || tools ? `<div class="modal-section modal-footer-meta">
          ${acBadges ? `<div class="ac-list">${acBadges}</div>` : ''}
          ${tools ? `<div class="skill-tool-badges">${tools}</div>` : ''}
        </div>` : ''}
        ${d.link ? `<div class="modal-section"><a href="${d.link}" target="_blank" class="btn btn-ghost">Voir le projet ↗</a></div>` : ''}
      </div>`;
  }
})();

/* ── Global thumb switcher ── */
window.setModalImg = (src, thumb) => {
  const main = document.getElementById('modalMainImg');
  if (main) main.src = src;
  document.querySelectorAll('.modal-gallery-thumb').forEach(t => t.classList.remove('active'));
  thumb?.classList.add('active');
};

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

/* ── 3D Card Tilt ── */
(function initTilt() {
  const isMobile = window.matchMedia('(hover: none)').matches;
  if (isMobile) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = e.clientX - r.left;
      const y  = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -14;
      const ry = ((x / r.width)  - 0.5) *  14;
      card.style.transition = 'box-shadow 0.15s';
      card.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.025)`;
      card.style.boxShadow  = `0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(85,125,209,0.12)`;
      card.style.setProperty('--mx', (x / r.width  * 100) + '%');
      card.style.setProperty('--my', (y / r.height * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s var(--ease-expo), box-shadow 0.55s';
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
  });
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
