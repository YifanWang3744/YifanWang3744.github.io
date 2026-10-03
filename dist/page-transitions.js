(() => {
  'use strict';
  const key = 'portfolio-page-transition';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.hidden = true;
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<div class="curtain-cap curtain-cap-top"></div><div class="curtain-title"><span class="intro-dot"></span><span class="curtain-label"></span></div><div class="curtain-cap curtain-cap-bottom"></div>';
  document.body.append(curtain);
  const label = curtain.querySelector('.curtain-label');
  const title = curtain.querySelector('.curtain-title');
  const top = curtain.querySelector('.curtain-cap-top');
  const bottom = curtain.querySelector('.curtain-cap-bottom');
  let navigating = false;
  let arrival;
  try {
    arrival = JSON.parse(sessionStorage.getItem(key));
    sessionStorage.removeItem(key);
  } catch { /* Native links remain available without session storage. */ }
  const animate = (element, frames, options) => element.animate(frames, { fill:'forwards', ...options });
  function reset() {
    navigating = false;
    curtain.getAnimations({ subtree:true }).forEach(animation => animation.cancel());
    document.getElementById('page').getAnimations().forEach(animation => animation.cancel());
    curtain.hidden = true;
    root.classList.remove('page-transitioning');
    document.getElementById('page').inert = false;
  }
  if (arrival?.path === location.pathname && Date.now() - arrival.time < 15000 && !reduced.matches) {
    root.dataset.pageArrival = 'true';
    root.classList.add('page-transitioning');
    curtain.hidden = false;
    label.textContent = document.body.dataset.pageTitle;
    top.style.height = '0px';
    bottom.style.height = '12vh';
    document.getElementById('page').inert = true;
    // Hold the destination title briefly, then lift the curved curtain.
    setTimeout(() => {
      animate(title, [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-50px)'}], {duration:350,easing:'ease-in'});
      animate(bottom, [{height:'12vh'},{height:'0vh'}], {duration:800,easing:'cubic-bezier(.76,0,.24,1)'});
      animate(document.getElementById('page'), [{transform:'translateY(120px)'},{transform:'translateY(0)'}], {duration:800,easing:'cubic-bezier(.22,1,.36,1)'});
      animate(curtain, [{transform:'translateY(0)'},{transform:'translateY(-120%)'}], {duration:800,easing:'cubic-bezier(.76,0,.24,1)'}).finished.then(() => {
        reset();
        const heading = document.querySelector('h1');
        heading.setAttribute('tabindex','-1');
        heading.focus({preventScroll:true});
        heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), {once:true});
      }).catch(reset);
    }, 180);
  }
  document.addEventListener('click', async event => {
    const link = event.target.closest('a[data-page-link]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const destination = new URL(link.href);
    if (destination.origin !== location.origin || destination.pathname === location.pathname || reduced.matches) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    label.textContent = destination.pathname === '/' ? 'About me' : 'What I build';
    curtain.hidden = false;
    top.style.height = '12vh';
    bottom.style.height = '0px';
    root.classList.add('page-transitioning');
    document.getElementById('page').inert = true;
    animate(title, [{opacity:0,transform:'translateY(35px)'},{opacity:1,transform:'translateY(0)'}], {duration:450,delay:150,easing:'ease-out'});
    animate(top, [{height:'12vh'},{height:'0vh'}], {duration:600,easing:'cubic-bezier(.76,0,.24,1)'});
    try {
      await animate(curtain, [{transform:'translateY(120%)'},{transform:'translateY(0)'}], {duration:600,easing:'cubic-bezier(.76,0,.24,1)'}).finished;
      try { sessionStorage.setItem(key, JSON.stringify({path:destination.pathname,time:Date.now()})); } catch { /* Destination keeps its own intro fallback. */ }
      location.assign(destination.href);
    } catch { reset(); }
  });
  window.addEventListener('pageshow', event => { if (event.persisted) reset(); });
})();
