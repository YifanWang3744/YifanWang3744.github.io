(() => {
  'use strict';
  const root = document.documentElement;
  const page = document.getElementById('page');
  const hero = document.getElementById('home');
  const intro = document.getElementById('intro');
  const greeting = document.getElementById('greeting');
  const skip = document.getElementById('intro-skip');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const locks = new Set();
  const initialHash = location.hash;
  let introFinished = false;
  let introLeaving = false;
  let skippedByUser = false;
  let timers = [];
  let paused = false;

  function setLock(reason, active) {
    active ? locks.add(reason) : locks.delete(reason);
    root.classList.toggle('is-locked', locks.size > 0);
  }
  function restoreAnchor() {
    if (!initialHash || location.hash !== initialHash) return;
    let id;
    try { id = decodeURIComponent(initialHash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
    root.style.scrollBehavior = previous;
  }
  function finishIntro() {
    if (introFinished) return;
    introFinished = true;
    timers.forEach(clearTimeout);
    timers = [];
    intro.hidden = true;
    page.inert = false;
    setLock('intro', false);
    restoreAnchor();
    if (skippedByUser) {
      const introFocus = window.matchMedia('(max-width: 700px)').matches
        ? document.getElementById('menu-toggle')
        : document.querySelector('.top-nav-links a');
      introFocus.focus({ preventScroll: true });
    }
    window.dispatchEvent(new Event('portfolio:intro-finished'));
  }
  function leaveIntro(immediate = false) {
    if (introFinished) return;
    if (immediate || reduced.matches) return finishIntro();
    if (introLeaving) return;
    introLeaving = true;
    intro.classList.add('is-leaving');
    hero.classList.add('is-entering');
    timers.push(setTimeout(finishIntro, 820));
  }
  // Register all exit paths before making the page inert.
  skip.addEventListener('click', () => { skippedByUser = true; leaveIntro(true); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !introFinished) { event.preventDefault(); skippedByUser = true; leaveIntro(true); }
  });
  intro.addEventListener('animationend', event => {
    if (event.target === intro && event.animationName === 'intro-lift') finishIntro();
  });
  window.addEventListener('error', finishIntro);
  window.addEventListener('pageshow', event => { if (event.persisted) finishIntro(); });
  // This timer is independent of resource loads and the animation-end event.
  timers.push(setTimeout(finishIntro, 4000));
  try {
    intro.hidden = false;
    page.inert = true;
    setLock('intro', true);
    skip.focus({ preventScroll: true });
    if (reduced.matches) {
      greeting.textContent = 'Hello · 你好';
      timers.push(setTimeout(finishIntro, 350));
    } else {
      const sequence = [['Hello',400],['Bonjour',180],['Hola',180],['Ciao',180],['Olá',180],['こんにちは',220],['你好',420],['Hallo',180],['Hello',200]];
      let time = 0;
      sequence.forEach(([word, duration]) => {
        timers.push(setTimeout(() => { if (!introLeaving && !introFinished) greeting.textContent = word; }, time));
        time += duration;
      });
      timers.push(setTimeout(() => leaveIntro(), time));
    }
  } catch { finishIntro(); }

  function initializeMenu() {
    const toggle = document.getElementById('menu-toggle');
    const dialog = document.getElementById('navigation-dialog');
    const close = document.getElementById('menu-close');
    if (typeof dialog.showModal !== 'function') return; // Top navigation remains usable.
    root.classList.add('has-menu');
    const links = [...dialog.querySelectorAll('.menu-links a')];
    let closeTimer;
    let afterClose;
    toggle.hidden = false;
    const updateToggle = () => toggle.classList.toggle('is-visible', window.scrollY > 100 || window.innerWidth <= 700);
    updateToggle();
    window.addEventListener('scroll', updateToggle, { passive: true });
    window.addEventListener('resize', updateToggle, { passive: true });
    function completeClose() {
      clearTimeout(closeTimer);
      if (dialog.open) dialog.close();
      dialog.classList.remove('is-closing');
      setLock('menu', false);
      toggle.setAttribute('aria-expanded', 'false');
      if (afterClose) {
        const hash = afterClose;
        afterClose = undefined;
        if (location.hash === hash) {
          document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: reduced.matches || paused ? 'instant' : 'smooth' });
        } else { location.hash = hash; }
        // Focus the destination for keyboard and screen-reader users.
        const destination = document.getElementById(hash.slice(1));
        if (destination) {
          destination.setAttribute('tabindex', '-1');
          destination.focus({ preventScroll: true });
          destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once: true });
        }
      } else { toggle.focus({ preventScroll: true }); }
    }
    function closeMenu(hash) {
      if (!dialog.open || dialog.classList.contains('is-closing')) return;
      afterClose = hash;
      if (reduced.matches || paused) return completeClose();
      dialog.classList.add('is-closing');
      closeTimer = setTimeout(completeClose, 460);
    }
    toggle.addEventListener('click', () => {
      if (dialog.open || !introFinished) return;
      const current = location.hash || '#home';
      links.forEach(link => current === link.getAttribute('href') ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
      dialog.showModal();
      setLock('menu', true);
      toggle.setAttribute('aria-expanded', 'true');
      close.focus({ preventScroll: true });
    });
    close.addEventListener('click', () => closeMenu());
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeMenu(); });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right) closeMenu();
    });
    dialog.addEventListener('close', () => { setLock('menu', false); toggle.setAttribute('aria-expanded', 'false'); });
    links.forEach(link => link.addEventListener('click', event => { event.preventDefault(); closeMenu(link.getAttribute('href')); }));
    window.addEventListener('pagehide', () => { if (dialog.open) { afterClose = undefined; completeClose(); } });
  }

  function initializeReveals() {
    if (!('IntersectionObserver' in window) || reduced.matches) return;
    const targets = [...document.querySelectorAll('.reveal, .reveal-line')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
    targets.forEach(target => {
      // Keep elements in the initial viewport visible, especially deep links.
      if (target.getBoundingClientRect().top >= window.innerHeight) target.classList.add('is-pending');
      observer.observe(target);
    });
    document.querySelectorAll('.skills-grid .reveal, .about-title .reveal-line').forEach((target, index) => {
      target.style.transitionDelay = `${index * 70}ms`;
      if (target.firstElementChild && target.classList.contains('reveal-line')) target.firstElementChild.style.transitionDelay = `${index * 70}ms`;
    });
    const showAll = () => {
      observer.disconnect();
      targets.forEach(target => { target.classList.remove('is-pending'); target.classList.add('is-visible'); });
    };
    reduced.addEventListener('change', event => { if (event.matches) showAll(); });
    document.getElementById('motion-toggle').addEventListener('click', showAll, { once: true });
    // A focused off-screen element should never stay visually hidden.
    document.addEventListener('focusin', event => {
      const target = event.target.closest('.reveal');
      if (target) { target.classList.remove('is-pending'); target.classList.add('is-visible'); }
    });
  }

  function initializeMotion() {
    const track = document.getElementById('name-track');
    const unit = track.querySelector('.name-unit');
    const control = document.getElementById('motion-toggle');
    const label = document.getElementById('motion-label');
    const curve = document.querySelector('.contact-curve');
    const contact = document.getElementById('contact');
    const surface = document.querySelector('.hero-surface');
    const role = document.querySelector('.hero-role');
    let width = unit.getBoundingClientRect().width;
    let offset = width * .01;
    let boost = 0;
    let lastY = window.scrollY;
    let lastTime;
    let frame;
    function active() { return !reduced.matches && !paused && !document.hidden && introFinished; }
    function tick(time) {
      frame = undefined;
      if (!active()) return;
      const delta = Math.min((time - (lastTime || time)) / 1000, .05);
      lastTime = time;
      if (window.scrollY < hero.offsetHeight + 100) {
        offset += (width * .056 + boost) * delta;
        offset = ((offset % width) + width) % width;
        track.style.transform = `translate3d(${-offset}px,0,0)`;
        surface.style.transform = `translate3d(0,${window.scrollY * .1}px,0)`;
        role.style.translate = `0 ${-Math.min(window.scrollY * .08, 65)}px`;
      }
      boost *= .94;
      const distance = contact.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - distance) / window.innerHeight));
      curve.style.transform = `scaleY(${1 - progress * .85})`;
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      control.hidden = reduced.matches;
      root.classList.toggle('motion-running', active());
      if (frame) cancelAnimationFrame(frame);
      frame = undefined;
      lastTime = undefined;
      if (!active()) {
        surface.style.transform = '';
        role.style.translate = '';
        curve.style.transform = '';
        if (reduced.matches) track.style.transform = '';
        return;
      }
      frame = requestAnimationFrame(tick);
    }
    control.addEventListener('click', () => {
      paused = !paused;
      root.classList.toggle('motion-paused', paused);
      control.setAttribute('aria-pressed', String(paused));
      label.textContent = paused ? 'Resume motion' : 'Pause motion';
      control.querySelector('.pause-symbol').textContent = paused ? '▷' : 'Ⅱ';
      sync();
    });
    window.addEventListener('scroll', () => {
      const diff = window.scrollY - lastY;
      if (Math.abs(diff) > 1) { boost = Math.min(Math.abs(diff) * 5, 550); }
      lastY = window.scrollY;
    }, { passive: true });
    window.addEventListener('resize', () => {
      const nextWidth = unit.getBoundingClientRect().width;
      offset = nextWidth * (offset / width);
      width = nextWidth;
    }, { passive: true });
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('portfolio:intro-finished', sync);
    reduced.addEventListener('change', () => { if (!introFinished) finishIntro(); sync(); });
    sync();
    const magnetic = document.querySelector('.magnetic');
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      magnetic.addEventListener('pointermove', event => {
        if (!active()) return;
        const box = magnetic.getBoundingClientRect();
        magnetic.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * .12}px,${(event.clientY - box.top - box.height / 2) * .12}px)`;
      });
      magnetic.addEventListener('pointerleave', () => { magnetic.style.transform = ''; });
      reduced.addEventListener('change', () => { magnetic.style.transform = ''; });
      control.addEventListener('click', () => { magnetic.style.transform = ''; });
    }
  }
  // Independent enhancements must not make essential content depend on each other.
  [initializeMenu, initializeReveals, initializeMotion].forEach(initialize => {
    try { initialize(); } catch (error) { console.warn('Portfolio enhancement unavailable:', error); }
  });
})();
