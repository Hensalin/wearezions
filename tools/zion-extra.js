
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
