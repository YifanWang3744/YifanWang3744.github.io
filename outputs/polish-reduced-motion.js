(() => {
  'use strict';
  const root = document.documentElement;
  const page = document.getElementById('page');
  const hero = document.getElementById('home');
  const intro = document.getElementById('intro');
  const greeting = document.getElementById('greeting');
  const reduced = { matches: true, addEventListener() {} };
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
    window.dispatchEvent(new Event('portfolio:page-revealing'));
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

  function initializeContactCopy() {
    const buttons = [...document.querySelectorAll('.contact-method[data-copy]')];
    if (!buttons.length) return;
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(toast);
    let toastTimer;
    async function copy(value) {
      if (navigator.clipboard?.writeText) {
        try { await navigator.clipboard.writeText(value); return; } catch { /* Try the local fallback. */ }
      }
      const field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(field);
      const previousFocus = document.activeElement;
      field.select();
      const success = document.execCommand('copy');
      field.remove();
      previousFocus?.focus({ preventScroll:true });
      if (!success) throw new Error('Copy unavailable');
    }
    buttons.forEach(button => {
      const display = button.querySelector('.contact-method-value');
      const original = display.textContent;
      let resetTimer;
      button.addEventListener('click', async () => {
        try {
          await copy(button.dataset.copy);
          clearTimeout(resetTimer);
          display.textContent = 'Copied';
          button.classList.add('is-copied');
          toast.textContent = 'Copied';
          toast.classList.add('is-visible');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
          resetTimer = setTimeout(() => {
            display.textContent = original;
            button.classList.remove('is-copied');
          }, 2000);
        } catch {
          toast.textContent = 'Could not copy. Please try again.';
          toast.classList.add('is-visible');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2500);
        }
      });
    });
  }

  function initializeBuildTitle() {
    const heading = document.getElementById('build-title');
    if (!heading || reduced.matches) return;
    const lines = [...heading.querySelectorAll('.build-title-line')];
    if (!lines.length) return;
    lines.forEach((line, index) => {
      line.style.setProperty('--title-delay', `${index * 360}ms`);
      line.style.setProperty('--title-duration', index === 0 ? '900ms' : '1800ms');
    });
    heading.classList.add('build-title-pending');
    let started = false;
    const observer = new MutationObserver(start);
    function start(event) {
      const revealing = event?.type === 'portfolio:page-revealing';
      if (started || (!revealing && (!introFinished || root.classList.contains('page-transitioning')))) return;
      started = true;
      observer.disconnect();
      heading.classList.remove('build-title-pending');
      if (!reduced.matches) heading.classList.add('build-title-playing');
    }
    observer.observe(root, { attributes:true, attributeFilter:['class'] });
    window.addEventListener('portfolio:intro-finished', start, { once:true });
    window.addEventListener('portfolio:page-revealing', start, { once:true });
    reduced.addEventListener('change', event => {
      if (!event.matches) return;
      started = true;
      observer.disconnect();
      heading.classList.remove('build-title-pending', 'build-title-playing');
    });
    start();
  }

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
    const buildImage = buildPhoto?.querySelector('.titanium-scene');
    const buildCopy = document.querySelector('.build-intro-copy');
    const buildPanel = buildPhoto?.querySelector('.titanium-main');
    const firstBuildLine = buildCopy?.querySelector('p');
    const overview = document.querySelector('.build-overview');
    const globe = document.querySelector('.globe');
    let copyShift = 0;
    function alignBuildCopy() {
      if (!buildCopy || !buildPanel) return;
      if (window.innerWidth <= 700) {
        buildCopy.style.translate = '';
        copyShift = 0;
        return;
      }
      const baseTop = firstBuildLine.getBoundingClientRect().top - copyShift;
      copyShift = buildPanel.getBoundingClientRect().top - baseTop;
      buildCopy.style.translate = `0 ${copyShift}px`;
    }

    const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let pointerTarget = 0;
    let pointerPosition = 0;
    if (buildPhoto) {
      buildPhoto.addEventListener('pointerenter', () => {
        if (!reduced.matches && hoverPointer.matches) buildPhoto.classList.add('is-hovered');
      });
      buildPhoto.addEventListener('pointermove', event => {
        if (reduced.matches || !hoverPointer.matches) return;
        const box = buildPhoto.getBoundingClientRect();
        pointerTarget = Math.max(-7, Math.min(7, ((event.clientX - box.left) / box.width - .5) * 17.5));
      });
      buildPhoto.addEventListener('pointerleave', () => {
        buildPhoto.classList.remove('is-hovered');
        pointerTarget = 0;
      });
    }
    let photoShift = 0;
    let width = unit?.getBoundingClientRect().width || 1;
    let offset = 0;
    let motionReady = introFinished;
    let boost = 0;
    let lastY = window.scrollY;
    let lastTime;
    let frame;
    function active() { return !reduced.matches && !document.hidden && motionReady; }
    function schedule() {
      if (frame === undefined && active()) frame = requestAnimationFrame(tick);
    }
    function tick(time) {
      frame = undefined;
      if (!active()) return;
      const delta = Math.min((time - (lastTime ?? time - 16.67)) / 1000, .05);
      lastTime = time;
      // Read layout together before changing transforms or CSS properties.
      const y = window.scrollY;
      const viewportHeight = window.innerHeight;
      const desktop = window.innerWidth > 700;
      const heroVisible = !!track && y < hero.offsetHeight + 100;
      const photoBox = buildPhoto?.getBoundingClientRect();
      const photoVisible = photoBox && photoBox.bottom > -100 && photoBox.top < viewportHeight + 100;
      const panelTop = photoVisible && desktop ? buildPanel.getBoundingClientRect().top - photoShift : 0;
      const copyTop = photoVisible && desktop ? firstBuildLine.getBoundingClientRect().top - copyShift : 0;
      const distance = contact.getBoundingClientRect().top;
      const contactHeight = contact.offsetHeight;
      const remaining = Math.max(0, document.documentElement.scrollHeight - viewportHeight - y);
      const globeBox = globe?.getBoundingClientRect();
      root.classList.toggle('motion-running', !!globeBox && globeBox.bottom > 0 && globeBox.top < viewportHeight);
      if (heroVisible) {
        offset += (width * .056 + boost) * delta;
        offset = ((offset % width) + width) % width;
        track.style.transform = `translate3d(${-offset}px,0,0)`;
        surface.style.transform = `translate3d(0,${y * .1}px,0)`;
        role.style.translate = `0 ${-Math.min(y * .08, 65)}px`;
      }
      boost *= .94;
      if (photoVisible) {
        const progress = Math.max(0, Math.min(1, (viewportHeight - photoBox.top) / (viewportHeight + photoBox.height)));
        const extent = photoBox.height * .2;
        const target = (progress - .5) * extent * 2;
        photoShift += (target - photoShift) * (1 - Math.exp(-delta * 12));
        photoShift = Math.max(-extent, Math.min(extent, photoShift));
        pointerPosition += (pointerTarget - pointerPosition) * (1 - Math.exp(-delta * 4));
        buildImage.style.transform = `translate3d(0,${photoShift}px,0)`;
        buildPhoto.style.setProperty('--pointer-x', `${pointerPosition}px`);
        copyShift = desktop ? panelTop + photoShift - copyTop : 0;
        buildCopy.style.translate = desktop ? `0 ${copyShift}px` : '';
      }
      if (overview) {
        const tint = Math.min(1, y / 900);
        overview.style.backgroundColor = `rgb(${255-22*tint},${255-21*tint},${255-20*tint})`;
      }
      const footerProgress = Math.max(0, Math.min(1, (viewportHeight - distance) / contactHeight));
      curve.style.height = `${viewportHeight * (desktop ? .1 : .075) * (1 - footerProgress)}px`;
      contactContent.style.transform = desktop ? `translate3d(0,${-Math.min(remaining, contactHeight) * .4}px,0)` : '';
      contactButton.style.translate = desktop ? `${-Math.min(remaining, contactHeight) * .1}px 0` : '';
      // Scroll events wake the loop again; invisible regions need no continuous work.
      if (heroVisible || photoVisible) schedule();
      else lastTime = undefined;
    }
    function sync() {
      root.classList.toggle('motion-running', active());
      if (frame && active()) return;
      if (frame) cancelAnimationFrame(frame);
      frame = undefined;
      lastTime = undefined;
      if (!active()) {
        if (surface) surface.style.transform = '';
        if (role) role.style.translate = '';
        if (buildImage) {
          buildImage.style.transform = ''; photoShift = 0;
          pointerPosition = pointerTarget = 0;
          buildPhoto.style.removeProperty('--pointer-x');
          buildPhoto.classList.remove('is-hovered');
        }
        alignBuildCopy();
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
      schedule();
    }, { passive: true });
    window.addEventListener('resize', () => {
      alignBuildCopy();
      schedule();
      if (!unit) return;
      const nextWidth = unit.getBoundingClientRect().width;
      offset = nextWidth * (offset / width);
      width = nextWidth;
    }, { passive: true });
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('portfolio:intro-finished', () => { motionReady = true; sync(); });
    window.addEventListener('portfolio:page-revealing', () => { motionReady = true; sync(); });
    reduced.addEventListener('change', () => { if (!introFinished) finishIntro(); sync(); });
    document.fonts?.ready.then(() => { alignBuildCopy(); schedule(); });
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
      if (window.innerWidth <= 700) { subtitle.style.fontSize = ''; return; }
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
  [initializeContactCopy, initializeBuildTitle, initializeSectionNavigation, initializeReveals, initializeMotion, fitHeroSubtitle, fitContentWidths].forEach(initialize => {
    try { initialize(); } catch (error) { console.warn('Portfolio enhancement unavailable:', error); }
  });
})();
