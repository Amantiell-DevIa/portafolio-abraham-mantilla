/* ==========================================================================
   Capa de movimiento («flow motion»): GSAP + ScrollTrigger (+ SplitText, Lenis).
   Comprueba la bandera, el movimiento reducido y las librerías antes de poner
   .flow-on. Si algo falta, la página se queda en su versión base, completa.
   ========================================================================== */
(function () {
  'use strict';
  const root = document.documentElement;
  if (!root.classList.contains('flow')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  const SplitText = window.SplitText;

  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });   // la barra del navegador móvil no recalcula todo
  root.classList.add('flow-on');

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const scrub = finePointer ? true : 0.5;              // con Lenis ya llega suavizado; en táctil, medio segundo
  const header = document.querySelector('[data-cabecera]');
  const headerH = () => (header ? header.offsetHeight : 0);
  const mm = gsap.matchMedia();

  function initSmoothScroll() {
    // Lenis solo con ratón o trackpad: en táctil manda el scroll nativo del teléfono
    if (!finePointer || typeof window.Lenis !== 'function') return;
    const lenis = new window.Lenis({ lerp: 0.09, anchors: { offset: -(headerH() + 8) } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Héroe en profundidad: aurora lenta, emblema medio, texto rápido
  function initHero() {
    const hero = document.querySelector('#inicio');
    if (!hero) return;
    const texto = hero.querySelector('.heroe__texto');
    const emblema = hero.querySelector('.heroe__emblema');
    const cielo = hero.querySelector('.aurora__cielo');
    const aros = hero.querySelector('.medallon__aros');
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub, invalidateOnRefresh: true }
    });
    if (cielo) tl.fromTo(cielo, { yPercent: 0 }, { yPercent: 16 }, 0);
    if (emblema) tl.fromTo(emblema, { y: 0, scale: 1 }, { y: () => -window.innerHeight * 0.07, scale: 0.94 }, 0);
    if (texto) tl.fromTo(texto, { y: 0, opacity: 1 }, { y: () => -window.innerHeight * 0.12, opacity: 0, ease: 'power1.in' }, 0);
    // El scroll suma giro al contenedor de los aros (las bandas giran aparte con CSS)
    if (aros) tl.fromTo(aros, { rotation: 0 }, { rotation: 110 }, 0);
  }

  // Titulares que suben línea a línea desde su máscara
  function initHeadings() {
    if (!SplitText) return;
    gsap.utils.toArray('[data-lineas]').forEach(el => {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'linea', autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 108, duration: 1.05, ease: 'power4.out', stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          });
        }
      });
    });
  }

  // Apariciones sueltas y tarjetas en cascada
  function initReveals() {
    gsap.utils.toArray('[data-revela]').forEach(el => {
      gsap.from(el, { y: 26, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    gsap.utils.toArray('[data-tarjetas]').forEach(list => {
      gsap.from(list.children, { y: 34, opacity: 0, duration: 0.95, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: list, start: 'top 86%', once: true } });
    });
    const galeria = document.querySelector('[data-galeria]');
    if (galeria) {
      gsap.from(galeria.children, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: galeria, start: 'top 86%', once: true } });
    }
  }

  // Sobre mí: el relato se ilumina palabra a palabra al leerlo
  function initStory() {
    const p = document.querySelector('[data-palabras]');
    if (!p || !SplitText) return;
    SplitText.create(p, {
      type: 'words', wordsClass: 'palabra', autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(self.words, { opacity: 0.2 }, {
          opacity: 1, ease: 'none', stagger: 0.12,
          scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 52%', scrub: true }
        });
      }
    });
    const trayecto = document.querySelector('[data-trayecto]');
    if (trayecto) {
      gsap.fromTo(trayecto, { '--avance': 0 }, { '--avance': 1, ease: 'none', scrollTrigger: { trigger: trayecto, start: 'top 85%', end: 'bottom 55%', scrub: true } });
      gsap.from(trayecto.children, { opacity: 0, y: 12, duration: 0.7, ease: 'power2.out', stagger: 0.12, scrollTrigger: { trigger: trayecto, start: 'top 85%', once: true } });
    }
  }

  // Proceso: la línea se llena con el scroll y el paso en curso se enciende (una sola fuente de verdad)
  function initProcess() {
    const list = document.querySelector('[data-pasos]');
    if (!list) return;
    const steps = [...list.children];
    gsap.fromTo(list, { '--progreso': 0 }, { '--progreso': 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 62%', end: 'bottom 62%', scrub: true } });
    const light = step => steps.forEach(s => s.classList.toggle('is-actual', s === step));
    light(steps[0]);
    steps.forEach(step => ScrollTrigger.create({
      trigger: step, start: 'top 62%', end: 'bottom 62%',
      onToggle: self => { if (self.isActive) light(step); }
    }));
  }

  // Cifras que cuentan hasta su valor real una vez
  function initCounters() {
    let fmt;
    try { fmt = new Intl.NumberFormat('es-ES', { useGrouping: 'always' }); } catch (e) { fmt = new Intl.NumberFormat('es-ES'); }
    gsap.utils.toArray('[data-cuenta]').forEach(el => {
      const end = Number(el.dataset.cuenta);
      const pre = el.dataset.prefijo || '';
      const suf = el.dataset.sufijo || '';
      const final = el.textContent;
      const state = { v: 0 };
      gsap.to(state, {
        v: end, duration: 1.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = pre + fmt.format(Math.round(state.v)) + suf; },
        onComplete: () => { el.textContent = final; }
      });
    });
  }

  // SoffIA: la conversación se escribe con el scroll mientras el teléfono queda fijo
  function initChat() {
    const fig = document.querySelector('[data-chat]');
    const caso = document.querySelector('[data-caso]');
    if (!fig || !caso) return;
    const screen = fig.querySelector('.movil__pantalla');
    const list = fig.querySelector('[data-chat-lista]');
    const items = [...list.children];
    const enLinea = fig.querySelector('.movil__enlinea');
    const escribe = fig.querySelector('.movil__escribe');
    // Desplazamiento de la lista para que el último mensaje visible quede abajo
    const shift = i => {
      const last = items[i];
      return Math.max(0, list.offsetTop + last.offsetTop + last.offsetHeight + 14 - screen.clientHeight);
    };

    mm.add({ wide: '(min-width: 1024px)', narrow: '(max-width: 1023px)' }, ctx => {
      const { wide } = ctx.conditions;
      const pin = wide ? caso : fig;   // escritorio: texto y teléfono juntos; móvil: solo el teléfono
      // El primer mensaje ya está escrito al llegar: el teléfono nunca se ve vacío
      const rest = items.slice(1);
      gsap.set(rest, { opacity: 0, y: 14 });
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out', duration: 0.5 },
        scrollTrigger: {
          trigger: pin,
          start: () => wide ? `center ${Math.round(headerH() + (window.innerHeight - headerH()) / 2)}px` : `top ${headerH() + 16}px`,
          end: () => '+=' + Math.round(window.innerHeight * (wide ? 2.4 : 2.1)),
          pin, scrub, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
      rest.forEach((it, n) => {
        const i = n + 1;
        const t = n * 0.9;
        if (it.classList.contains('msj--bot')) {
          tl.to(enLinea, { opacity: 0, duration: 0.15 }, t - 0.5)
            .to(escribe, { opacity: 1, duration: 0.15 }, t - 0.5)
            .to(escribe, { opacity: 0, duration: 0.15 }, t - 0.05)
            .to(enLinea, { opacity: 1, duration: 0.15 }, t - 0.05);
        }
        tl.to(it, { opacity: 1, y: 0 }, t);
        tl.to(list, { y: () => -shift(i), duration: 0.45, ease: 'power2.inOut' }, t);
      });
      tl.to({}, { duration: 0.8 });   // respiro al final, con la conversación completa
    });
  }

  // Cierre: la aurora vuelve con un parallax suave
  function initFinal() {
    const cielo = document.querySelector('.aurora--final .aurora__cielo');
    if (!cielo) return;
    gsap.fromTo(cielo, { yPercent: -10 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '#contacto', start: 'top bottom', end: 'bottom top', scrub } });
  }

  // En ORDEN DE PÁGINA: lo que va debajo de una sección fijada se crea después de ella
  initSmoothScroll();
  initHero();
  initHeadings();
  initReveals();
  initStory();
  initProcess();
  initCounters();
  initChat();
  initFinal();
  ScrollTrigger.sort();

  // Fuentes e imágenes cambian alturas: recalcula cuando todo cargó
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}());
