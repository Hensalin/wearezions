/* Full-page scroll "flow": a glowing line that draws down the centre rail, staggered entrances for every block,
   scroll-speed skew on headings, floating parallax on images, and a soft cursor glow. Everything is skipped for reduced motion. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 1 · scroll-progress line down the middle rail */
  var root = document.querySelector('.rails i:nth-child(2)') || document.documentElement;  /* scoped: a custom property on <html> restyles the whole page every frame */
  var last = ''; ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { var v = s.progress.toFixed(3); if (v !== last) { last = v; root.style.setProperty('--p', v); } } });

  /* 2 · staggered entrances for grouped blocks (skips anything another script already animates) */
  var groups = [
    ['.plans__grid', '.plans__grid > *'],
    ['.footer__top', '.footer__top > *'],
    ['.stat__row', '.stat__i'],
    ['.visit', '.visit > *'],
    ['.program', '.prow']
  ];
  groups.forEach(function (g) {
    var host = document.querySelector(g[0]); if (!host) return;
    var items = $$(g[1]).filter(function (el) { return !el.hasAttribute('data-reveal') && !el.hasAttribute('data-split') && !el.classList.contains('mask'); });
    if (!items.length) return;
    gsap.from(items, { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .09, immediateRender: false,
      scrollTrigger: { trigger: host, start: 'top 82%', once: true }, clearProps: 'transform,opacity' });
  });

  /* 3 · big footer wordmark rises and tightens */
  var mega = document.querySelector('.footer__mega');
  if (mega) gsap.fromTo(mega, { yPercent: 30, opacity: 0, letterSpacing: '.08em' }, { yPercent: 0, opacity: 1, letterSpacing: '0em', ease: 'none',
    scrollTrigger: { trigger: mega, start: 'top 105%', end: 'top 60%', scrub: true } });

  /* 4 · plain headings without their own split animation fade/slide in */
  $$('section h2').filter(function (h) { return !h.hasAttribute('data-split') && !h.hasAttribute('data-reveal') && !h.closest('.hero') && !h.closest('.panel'); }).forEach(function (h) {
    gsap.from(h, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', immediateRender: false, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });

  /* parallax + heading skew removed: they made scrolling jitter */

  /* 7 · soft gold cursor glow (desktop) */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var g = document.createElement('div'); g.className = 'flow-glow'; g.setAttribute('aria-hidden', 'true'); document.body.appendChild(g);
    var qx = gsap.quickTo(g, 'x', { duration: .7, ease: 'power3' }), qy = gsap.quickTo(g, 'y', { duration: .7, ease: 'power3' });
    window.addEventListener('mousemove', function (e) { qx(e.clientX); qy(e.clientY); g.style.opacity = 1; });
    document.addEventListener('mouseleave', function () { g.style.opacity = 0; });
  }
  ScrollTrigger.refresh();
})();
