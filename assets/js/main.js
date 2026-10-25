/* ==========================================================================
   Comportamiento base: funciona sin GSAP. Si Flip está cargado y no hay
   movimiento reducido, la galería anima el reacomodo; si no, cambia al instante.
   Se inicia en DOMContentLoaded: para entonces ya corrieron todos los scripts
   diferidos, incluidas las librerías.
   ========================================================================== */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Cabecera con fondo en cuanto se baja un poco
  function initHeader() {
    const header = document.querySelector('[data-cabecera]');
    if (!header) return;
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // Auroras: texturas al acercarse (is-near), en marcha la primera vez que se ven (is-live) y en pausa fuera (is-paused)
  function initAuroras() {
    const auroras = [...document.querySelectorAll('.aurora')];
    if (!auroras.length) return;
    if (!('IntersectionObserver' in window)) { auroras.forEach(a => a.classList.add('is-near', 'is-live')); return; }
    const near = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-near'); near.unobserve(e.target); }
    }), { rootMargin: '60% 0px' });
    const visible = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-live');
      e.target.classList.toggle('is-paused', !e.isIntersecting);
    }), { rootMargin: '10% 0px' });
    auroras.forEach(a => { near.observe(a); visible.observe(a); });
  }

  // Animaciones continuas (aros del medallón, cursor de «Tu próxima web»): en pausa fuera de la vista
  function initPauses() {
    const zones = [...document.querySelectorAll('[data-vida]')];
    if (!zones.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      e.target.classList.toggle('is-paused', !e.isIntersecting);
    }), { rootMargin: '10% 0px' });
    zones.forEach(z => io.observe(z));
  }

  // Galería «escenario»: en escritorio con ratón, la portada que se señala pasa a grande arriba
  // y las demás se recolocan debajo en su orden. En el resto de casos, carrusel o rejilla de enlaces.
  function initGallery() {
    const list = document.querySelector('[data-galeria]');
    if (!list) return;
    const items = [...list.querySelectorAll('.obra')];
    if (items.length < 2) return;
    const stageMode = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const parts = item => ({
      media: item.querySelector('.obra__media'),
      head: item.querySelector('.obra__cabecera'),
      detail: item.querySelector('.obra__detalle')
    });

    // Un estado, una fuente de verdad: solo activate() decide qué obra está en escena
    let active = items.find(i => i.classList.contains('is-activa')) || items[0];
    items.forEach(i => i.classList.toggle('is-activa', i === active));
    let flip = null;
    let fade = null;
    let pending = 0;
    let locked = null;          // la obra que quedó bajo el cursor tras un cambio: espera a que el cursor salga
    let pointer = { x: -1, y: -1 };
    let lastMove = 0;           // último movimiento real del ratón (los eventos sintéticos tras un scroll no cuentan)
    let lastScroll = 0;

    function itemAt(x, y) {
      // Se mira el li (sin transformar), no la portada en vuelo: es donde quedará cada obra
      return items.find(i => { const r = i.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }) || null;
    }

    function activate(item, { animate = true } = {}) {
      if (!item || item === active) return;
      const prev = active;
      const { gsap, Flip } = window;
      const canAnimate = animate && list.classList.contains('is-escenario') && gsap && Flip && !reduce.matches;

      if (!canAnimate) {
        prev.classList.remove('is-activa');
        item.classList.add('is-activa');
        active = item;
        return;
      }

      if (flip) flip.progress(1);     // termina el cambio anterior antes de medir
      if (fade) fade.progress(1);
      const movers = items.filter(i => i !== prev && i !== item);
      const targets = items.map(i => parts(i).media).concat(movers.map(i => parts(i).head));
      const state = Flip.getState(targets);

      prev.classList.remove('is-activa');
      item.classList.add('is-activa');
      active = item;

      // Lo que cambia de forma (los textos de las dos obras que se cruzan) se funde; las portadas vuelan
      const fresh = [parts(item).head, parts(item).detail, parts(prev).head].filter(Boolean);
      gsap.set(fresh, { opacity: 0 });
      flip = Flip.from(state, {
        targets,
        duration: .72,
        ease: 'power3.inOut',
        scale: true,
        zIndex: 3,
        onComplete: () => { gsap.set(parts(item).media, { clearProps: 'zIndex' }); flip = null; }
      });
      gsap.set(parts(item).media, { zIndex: 5 });
      fade = gsap.fromTo(fresh, { opacity: 0, y: 14 }, {
        opacity: 1, y: 0, duration: .55, ease: 'power2.out', delay: .34, stagger: .06,
        clearProps: 'transform', onComplete: () => { fade = null; }
      });
    }

    function setMode() {
      const on = stageMode.matches;
      list.classList.toggle('is-escenario', on);
      if (!on && window.gsap) {
        if (flip) flip.progress(1);
        if (fade) fade.progress(1);
        window.gsap.set(items.flatMap(i => Object.values(parts(i))).filter(Boolean), { clearProps: 'all' });
      }
    }
    setMode();
    if (stageMode.addEventListener) stageMode.addEventListener('change', setMode);

    // Solo mueve la galería un movimiento real del ratón: los eventos que el navegador lanza al
    // desplazarse la página bajo un cursor quieto no reordenan nada
    let candidate = null;
    window.addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });
    list.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || !list.classList.contains('is-escenario')) return;
      const moved = e.clientX !== pointer.x || e.clientY !== pointer.y;
      pointer = { x: e.clientX, y: e.clientY };
      if (!moved) return;
      lastMove = performance.now();
      if (lastMove - lastScroll < 140) return;
      const under = itemAt(pointer.x, pointer.y);
      if (locked && under !== locked) locked = null;
      if (!under || under === active || under === locked) { clearTimeout(pending); candidate = null; return; }
      if (under === candidate) return;
      candidate = under;
      clearTimeout(pending);
      // Un instante de intención: cruzar la fila camino de otro sitio no reordena nada
      pending = setTimeout(() => {
        candidate = null;
        if (itemAt(pointer.x, pointer.y) !== under || performance.now() - lastMove > 400) return;
        activate(under);
        // Tras el cambio, otra obra queda bajo el cursor: no se activa hasta que el cursor salga de ella
        const now = itemAt(pointer.x, pointer.y);
        locked = now && now !== active ? now : null;
      }, 90);
    }, { passive: true });
    list.addEventListener('pointerleave', () => { clearTimeout(pending); candidate = null; locked = null; });

    // Teclado: al llegar con Tab, la obra pasa a escena; Intro abre la web
    items.forEach(item => {
      const link = item.querySelector('a');
      if (link) link.addEventListener('focus', () => {
        if (list.classList.contains('is-escenario') && link.matches(':focus-visible')) activate(item);
      });
    });
  }

  // Puntos del carrusel en móvil: marcan la tarjeta visible
  function initDots() {
    const list = document.querySelector('[data-galeria]');
    const dots = [...document.querySelectorAll('[data-puntos] i')];
    if (!list || !dots.length || !('IntersectionObserver' in window)) return;
    const items = [...list.querySelectorAll('.obra')];
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const index = items.indexOf(e.target);
      dots.forEach((d, j) => d.classList.toggle('is-on', j === index));
    }), { root: list, threshold: .6 });
    items.forEach(i => io.observe(i));
  }

  function initYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = year; });
  }

  function init() {
    initHeader();
    initAuroras();
    initPauses();
    initGallery();
    initDots();
    initYear();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
