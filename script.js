// ---------- Carrusel ----------
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dots button'));
  const hero = document.querySelector('.hero');
  if (!slides.length || !hero) return;

  let current = 0;
  let timer;

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const on = n === current;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      s.querySelectorAll('a').forEach(a => a.tabIndex = on ? 0 : -1);
    });
    dots.forEach((d, n) => {
      d.classList.toggle('is-active', n === current);
      d.setAttribute('aria-selected', n === current ? 'true' : 'false');
    });
  }
  function start() { stop(); timer = setInterval(() => show(current + 1), 6000); }
  function stop() { clearInterval(timer); }

  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); start(); }));
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);

  // Deslizar con el dedo en celular
  let x0 = null;
  hero.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (x0 !== null) {
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    }
    x0 = null; start();
  });

  show(0);
  start();
})();

// ---------- Submenú de Productos (en pantallas táctiles se abre al tocar) ----------
(function () {
  const item = document.querySelector('.has-sub');
  if (!item) return;
  const link = item.querySelector(':scope > a');
  link.addEventListener('click', e => {
    if (window.matchMedia('(max-width: 1000px), (hover: none)').matches) {
      e.preventDefault();
      item.classList.toggle('is-open');
    }
  });
  document.addEventListener('click', e => { if (!item.contains(e.target)) item.classList.remove('is-open'); });
})();

// ---------- Aparición suave al hacer scroll ----------
(function () {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const sel = 'main > h1, main > section:not(.hero), main article:not(.slide), main [class*="card"]';
  const vh = window.innerHeight;
  const els = Array.from(document.querySelectorAll(sel)).filter(el => !el.closest('.slide'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el, i) => {
    if (el.getBoundingClientRect().top < vh) return;   // lo que ya se ve al cargar no se anima
    el.classList.add('rv');
    const sibs = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.classList.contains('rv') || c === el) : [];
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 4) * 0.08 + 's');
    io.observe(el);
  });
})();

// ---------- Catálogo: ventana flotante con el flipbook ----------
(function () {
  const links = document.querySelectorAll('a[data-catalog]');
  if (!links.length) return;
  const url = links[0].href;
  const modal = document.createElement('div');
  modal.className = 'cat-modal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Catálogo de productos');
  modal.innerHTML = '<div class="cat-modal__box"><div class="cat-modal__bar"><span>Catálogo Laura</span>' +
    '<a href="' + url + '" target="_blank" rel="noopener">Abrir en pestaña nueva ↗</a>' +
    '<button type="button" aria-label="Cerrar">✕</button></div><iframe title="Catálogo" allowfullscreen allow="fullscreen"></iframe></div>';
  document.body.appendChild(modal);
  const frame = modal.querySelector('iframe');
  let last;
  function open(e) {
    e.preventDefault(); last = document.activeElement;
    if (!frame.src) frame.src = url;
    modal.hidden = false; document.body.style.overflow = 'hidden';
    modal.querySelector('button').focus();
  }
  function close() { modal.hidden = true; document.body.style.overflow = ''; if (last) last.focus(); }
  links.forEach(a => a.addEventListener('click', open));
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('button')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
})();

// ---------- Visor del código QR ----------
(function () {
  const links = document.querySelectorAll('a[data-qr]');
  if (!links.length) return;
  const m = document.createElement('div');
  m.className = 'qr-modal'; m.hidden = true; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
  m.innerHTML = '<div class="qr-modal__box"><button type="button" aria-label="Cerrar">✕</button><img src="img/qr.png" alt="Código QR"><p>Escanea con la cámara de tu celular</p></div>';
  document.body.appendChild(m);
  const close = () => { m.hidden = true; document.body.style.overflow = ''; };
  links.forEach(a => a.addEventListener('click', e => { e.preventDefault(); m.hidden = false; document.body.style.overflow = 'hidden'; m.querySelector('button').focus(); }));
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('button')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// ---------- Promociones: galería de cada oferta ----------
(function () {
  document.querySelectorAll('.pm-offer').forEach(off => {
    const main = off.querySelector('.pm-offer__img');
    const thumbs = Array.from(off.querySelectorAll('.pm-offer__t1, .pm-offer__t2'));
    if (!main || !thumbs.length) return;
    const views = [main.getAttribute('src')].concat(thumbs.map(t => t.dataset.full));
    let cur = 0;
    function show(i) {
      if (i === cur) return;
      cur = i; main.classList.add('is-fade');
      setTimeout(() => { main.src = views[i]; main.classList.remove('is-fade'); }, 150);
      thumbs.forEach((t, k) => t.style.outline = (k + 1 === i) ? '2px solid #ec008c' : '');
    }
    thumbs.forEach((t, k) => {
      t.addEventListener('click', () => show(cur === k + 1 ? 0 : k + 1));
      t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } });
    });
    main.addEventListener('click', () => show((cur + 1) % views.length));   // en celular: tocar la foto cambia la vista
  });
})();

// ---------- Entrada al cargar la página ----------
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const vh = window.innerHeight;
  const items = Array.from(document.querySelectorAll('main > h1, main > h2, main > section:not(.rv), main > .abs, main > article, .hero, .crumb, .pm-hero')).filter(el => !el.classList.contains('rv') && el.getBoundingClientRect().top < vh);
  items.forEach((el, i) => { el.style.animationDelay = (0.15 + i * 0.1) + 's'; el.classList.add('ld'); });
})();
