/* zion.js — small, additive motion layer (GSAP + ScrollTrigger already on the page).
   1. Staggered entrance for the Sunday cards.
   Skipped entirely for prefers-reduced-motion. No new dependencies. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  /* 1 · Sunday cards: rise in one after another, then hand control back to CSS hover */
  var cards = document.querySelectorAll('.sun__card, .sun__where');
  if (cards.length) {
    gsap.from(cards, {
      y: 48, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12, immediateRender: false,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '.sun__grid', start: 'top 82%', once: true }
    });
  }
})();

/* sub-pages: image mask reveal + hero entrance */
(function(){
  if (!document.body.classList.contains('subpage')) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var imgs = document.querySelectorAll('.zimg[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) { imgs.forEach(function(e){ e.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { threshold: .15 });
  imgs.forEach(function(e){ io.observe(e); });
  if (window.gsap && window.ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: .95, ease: 'power3.out', stagger: .09 }); } }); }
})();

/* sub-pages: hero parallax + blog reading progress */
(function(){
  if (!document.body.classList.contains('subpage')) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = document.querySelector('.zprog');
  if (bar) {
    var art = document.querySelector('.zart__body');
    var tick = false;
    var upd = function(){ tick = false; if (!art) return; var r = art.getBoundingClientRect(); var h = r.height - innerHeight * .6; var p = Math.min(1, Math.max(0, (-r.top + innerHeight * .2) / Math.max(1, h))); bar.style.setProperty('--zp', p.toFixed(4)); };
    addEventListener('scroll', function(){ if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }
  if (reduce || !window.gsap || !window.ScrollTrigger) return;
  document.querySelectorAll('[data-parallax]').forEach(function(img){
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
})();

/* More dropdown: click/tap, Escape and outside click (hover and focus handled in CSS) */
(function(){
  var more = document.querySelector('.nav__more'); if (!more) return;
  var btn = more.querySelector('button');
  function set(o){ more.classList.toggle('is-open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
  btn.addEventListener('click', function(e){ e.stopPropagation(); set(!more.classList.contains('is-open')); });
  document.addEventListener('click', function(e){ if (!more.contains(e.target)) set(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { set(false); btn.blur(); } });
})();

/* click-to-play featured video */
(function(){
  document.addEventListener('click', function(e){
    var b = e.target.closest('.zplay'); if (!b) return;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-vid') + '?autoplay=1&rel=0';
    f.title = b.getAttribute('aria-label') || 'Video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('allowfullscreen', '');
    b.replaceWith(f);
  });
})();
