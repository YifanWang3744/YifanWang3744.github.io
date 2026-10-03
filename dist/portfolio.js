(() => {
  'use strict';
  const root = document.documentElement;
  const page = document.getElementById('page');
  const hero = document.getElementById('home');
  const intro = document.getElementById('intro');
  const greeting = document.getElementById('greeting');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const locks = new Set();
  const isReload = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  history.scrollRestoration = 'manual';
  if (isReload) history.replaceState(null, '', location.pathname + location.search);
  const initialHash = location.hash;
  if (!initialHash) window.scrollTo({ top:0, behavior:'instant' });
  let introFinished = false;
  let introLeaving = false;
  let skippedByUser = false;
  let timers = [];

  function setLock(reason, active) {
    active ? locks.add(reason) : locks.delete(reason);
    root.classList.toggle('is-locked', locks.size > 0);
  }
  function restoreAnchor() {
    if (!initialHash) { window.scrollTo({ top:0, behavior:'instant' }); return; }
    if (location.hash !== initialHash) return;
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
    page.inert = root.classList.contains('page-transitioning');
    setLock('intro', false);
    restoreAnchor();
    if (skippedByUser) {
      const introFocus = document.querySelector('.brand');
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
    if (root.dataset.pageArrival === 'true') {
      finishIntro();
    } else if (document.body.dataset.page === 'build' && !reduced.matches) {
      greeting.textContent = 'What I build';
      timers.push(setTimeout(() => leaveIntro(), 650));
    } else if (reduced.matches) {
      greeting.textContent = 'Hello · 你好';
      timers.push(setTimeout(finishIntro, 350));
    } else {
      const sequence = ['Hello', '你好', 'Bonjour', 'Hola', 'Ciao', 'Olá', 'こんにちは', 'Hallo', 'Hello'];
      const greetingDuration = 240;
      let time = 0;
      sequence.forEach(word => {
        timers.push(setTimeout(() => { if (!introLeaving && !introFinished) greeting.textContent = word; }, time));
        time += greetingDuration;
      });
      timers.push(setTimeout(() => leaveIntro(), time));
    }
  } catch { finishIntro(); }

  function initializeSectionNavigation() {
    const nav = document.querySelector('.section-nav');
    if (!nav) return;
    const links = [...nav.querySelectorAll('a')];
    const sections = links.map(link => document.querySelector(link.getAttribute('href')));
    let frame;
    function update() {
      frame = undefined;
      const probe = window.innerHeight * .35;
      let current = sections[0];
      sections.forEach(section => { if (section.getBoundingClientRect().top <= probe) current = section; });
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections.at(-1);
      links.forEach(link => {
        if (link.getAttribute('href') === `#${current.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      // Each rail item fades as its own position crosses the white-content boundaries.
      const start = hero.getBoundingClientRect().bottom;
      const end = document.getElementById('contact').getBoundingClientRect().top;
      links.forEach(link => {
        const box = link.getBoundingClientRect();
        const midpoint = box.top + box.height / 2;
        const opacity = Math.max(0, Math.min(1, (midpoint - start) / 60, (end - midpoint) / 60));
        link.style.opacity = String(opacity);
        link.style.visibility = opacity > 0 ? 'visible' : 'hidden';
      });
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive:true });
    window.addEventListener('resize', schedule, { passive:true });
    window.addEventListener('portfolio:intro-finished', update);
    links.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const destination = document.querySelector(link.getAttribute('href'));
      history.replaceState(null, '', link.getAttribute('href'));
      destination.scrollIntoView({ behavior:'instant', block:'start' });
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll:true });
      destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once:true });
      update();
    }));
    update();
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
    // A focused off-screen element should never stay visually hidden.
    document.addEventListener('focusin', event => {
      const target = event.target.closest('.reveal');
      if (target) { target.classList.remove('is-pending'); target.classList.add('is-visible'); }
    });
  }

  function initializeMotion() {
    const track = document.getElementById('name-track');
    const unit = track?.querySelector('.name-unit');
    const curve = document.querySelector('.contact-curve');
    const contact = document.getElementById('contact');
    const contactContent = contact.querySelector('.contact-content');
    const contactButton = contact.querySelector('.contact-action .circle-button');
    const surface = document.querySelector('.hero-surface');
    const role = document.querySelector('.hero-role');
    const buildPhoto = document.querySelector('.build-photo');
    const buildImage = buildPhoto?.querySelector('img');
    let photoShift = 0;
    let width = unit?.getBoundingClientRect().width || 1;
    let offset = width * .01;
    let boost = 0;
    let lastY = window.scrollY;
    let lastTime;
    let frame;
    function active() { return !reduced.matches && !document.hidden && introFinished; }
    function tick(time) {
      frame = undefined;
      if (!active()) return;
      const delta = Math.min((time - (lastTime || time)) / 1000, .05);
      lastTime = time;
      if (track && window.scrollY < hero.offsetHeight + 100) {
        offset += (width * .056 + boost) * delta;
        offset = ((offset % width) + width) % width;
        track.style.transform = `translate3d(${-offset}px,0,0)`;
        surface.style.transform = `translate3d(0,${window.scrollY * .1}px,0)`;
        role.style.translate = `0 ${-Math.min(window.scrollY * .08, 65)}px`;
      }
      boost *= .94;
      if (buildImage) {
        const box = buildPhoto.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - box.top) / (window.innerHeight + box.height)));
        const extent = box.height * .2;
        const target = (progress - .5) * extent * 2;
        photoShift += (target - photoShift) * (1 - Math.exp(-delta * 12));
        photoShift = Math.max(-extent, Math.min(extent, photoShift));
        buildImage.style.transform = `translate3d(0,${photoShift}px,0)`;
      }
      const overview = document.querySelector('.build-overview');
      if (overview) {
        const tint = Math.min(1, window.scrollY / 900);
        overview.style.backgroundColor = `rgb(${255-22*tint},${255-21*tint},${255-20*tint})`;
      }
      const distance = contact.getBoundingClientRect().top;
      const footerProgress = Math.max(0, Math.min(1, (window.innerHeight - distance) / contact.offsetHeight));
      curve.style.height = `${window.innerHeight * (window.innerWidth <= 700 ? .075 : .1) * (1 - footerProgress)}px`;
      const remaining = Math.max(0, document.documentElement.scrollHeight - window.innerHeight - window.scrollY);
      const desktop = window.innerWidth > 700;
      contactContent.style.transform = desktop ? `translate3d(0,${-Math.min(remaining, contact.offsetHeight) * .4}px,0)` : '';
      contactButton.style.translate = desktop ? `${-Math.min(remaining, contact.offsetHeight) * .1}px 0` : '';
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      root.classList.toggle('motion-running', active());
      if (frame) cancelAnimationFrame(frame);
      frame = undefined;
      lastTime = undefined;
      if (!active()) {
        if (surface) surface.style.transform = '';
        if (role) role.style.translate = '';
        if (buildImage) { buildImage.style.transform = ''; photoShift = 0; }
        curve.style.height = '0px';
        contactContent.style.transform = '';
        contactButton.style.translate = '';
        if (reduced.matches && track) track.style.transform = '';
        return;
      }
      frame = requestAnimationFrame(tick);
    }
    window.addEventListener('scroll', () => {
      const diff = window.scrollY - lastY;
      if (Math.abs(diff) > 1) { boost = Math.min(Math.abs(diff) * 5, 550); }
      lastY = window.scrollY;
    }, { passive: true });
    window.addEventListener('resize', () => {
      if (!unit) return;
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
    }
  }
  function fitHeroSubtitle() {
    const title = document.querySelector('.hero-profession');
    const subtitle = document.querySelector('.hero-focus-text');
    if (!title || !subtitle) return;
    const fit = () => {
      subtitle.style.fontSize = '16px';
      const textWidth = subtitle.getBoundingClientRect().width;
      if (textWidth) subtitle.style.fontSize = `${16 * title.getBoundingClientRect().width / textWidth}px`;
    };
    fit();
    window.addEventListener('resize', fit, { passive: true });
    document.fonts?.ready.then(fit);
  }
  function fitContentWidths() {
    const summary = document.querySelector('.about-summary');
    const lines = summary ? [...summary.querySelectorAll('span')] : [];
    const contactLine = document.getElementById('contact-first-line');
    const contactLinks = document.querySelector('.contact-links');
    function fit() {
      if (summary) summary.style.width = '100%';
      lines.forEach(line => { line.style.fontSize = ''; });
      if (summary && window.innerWidth > 700) {
        const available = summary.clientWidth;
        const widths = lines.map(line => {
          line.style.width = 'max-content';
          const width = line.getBoundingClientRect().width;
          line.style.width = '';
          return width;
        });
        const target = Math.min(available, Math.max(...widths));
        summary.style.width = `${target}px`;
        lines.forEach((line, index) => { line.style.fontSize = `${16 * target / widths[index]}px`; });
      }
      contactLinks.style.width = `${contactLine.getBoundingClientRect().width}px`;
    }
    fit();
    window.addEventListener('resize', fit, { passive:true });
    document.fonts?.ready.then(fit);
  }
  // Independent enhancements must not make essential content depend on each other.
  [initializeSectionNavigation, initializeReveals, initializeMotion, fitHeroSubtitle, fitContentWidths].forEach(initialize => {
    try { initialize(); } catch (error) { console.warn('Portfolio enhancement unavailable:', error); }
  });
})();
