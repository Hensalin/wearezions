(function(){var h=document.querySelector('.ph__title');if(h){h.style.opacity=0;setTimeout(function(){h.style.opacity=1},2500)}})();
/* Give page: scroll animation in the same language as the homepage (masked title rise, scroll-lit scripture, drifting marquee, staggered cards) */
window.addEventListener('load', function(){
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  /* 1 · title: words rise out of a mask */
  var h1 = document.querySelector('.ph__title');
  if (h1) {
    var txt = h1.textContent.trim(); h1.setAttribute('aria-label', txt); h1.innerHTML = '';
    var ws = [];
    txt.split(/\s+/).forEach(function(w, i, a){
      var m = document.createElement('span'); m.setAttribute('aria-hidden', 'true'); m.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding:.08em .06em .16em;margin:-.08em -.06em -.16em';
      var n = document.createElement('i'); n.textContent = w; n.style.cssText = 'display:inline-block;font-style:normal;will-change:transform'; m.appendChild(n); h1.appendChild(m); ws.push(n);
      if (i < a.length - 1) h1.appendChild(document.createTextNode(' '));
    });
    h1.style.opacity = 1;
    gsap.set(ws, { yPercent: 115 });
    gsap.to(ws, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .09, delay: .15 });
  }

  /* 2 · scripture: words light up as you scroll */
  var q = document.querySelector('.zscripture blockquote');
  if (q) {
    var t = q.textContent.trim(); q.setAttribute('aria-label', t); q.innerHTML = '';
    var lw = [];
    t.split(/\s+/).forEach(function(w, i, a){
      var s = document.createElement('span'); s.textContent = w; s.setAttribute('aria-hidden', 'true'); s.style.opacity = .14; q.appendChild(s); lw.push(s);
      if (i < a.length - 1) q.appendChild(document.createTextNode(' '));
    });
    q.style.opacity = 1;
    gsap.to(lw, { opacity: 1, ease: 'none', stagger: .12, scrollTrigger: { trigger: q, start: 'top 82%', end: 'bottom 45%', scrub: true } });
    var c = document.querySelector('.zscripture cite');
    if (c) gsap.fromTo(c, { opacity: 0, y: 20 }, { opacity: .65, y: 0, ease: 'none', scrollTrigger: { trigger: c, start: 'top 95%', end: 'top 70%', scrub: true } });
  }

  /* 3 · marquee band drifts sideways with the scroll */
  document.querySelectorAll('.zmarq__t').forEach(function(tr, i){
    gsap.fromTo(tr, { xPercent: i ? -30 : 0 }, { xPercent: i ? 0 : -30, ease: 'none', scrollTrigger: { trigger: tr.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* 4 · the three ways: rise in with a soft tilt, the middle one lags for depth */
  var cards = document.querySelectorAll('.zways3 article');
  if (cards.length) {
    cards.forEach(function(el){ el.removeAttribute('data-reveal'); el.style.opacity = 1; });
    gsap.from(cards, { y: 90, opacity: 0, rotate: function(i){ return (i - 1) * 3; }, scale: .94, duration: 1.2, ease: 'expo.out', stagger: .16, immediateRender: false, scrollTrigger: { trigger: '.zways3', start: 'top 82%', once: true } });
    if (cards[1]) gsap.fromTo(cards[1], { y: 30 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '.zways3', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* 5 · bank rows slide in one by one */
  var rows = document.querySelectorAll('.zrow');
  if (rows.length) gsap.from(rows, { x: -30, opacity: 0, duration: .9, ease: 'expo.out', stagger: .09, immediateRender: false, scrollTrigger: { trigger: '.zdl', start: 'top 85%', once: true } });

  /* 6 · QR scales in */
  var qr = document.querySelector('.zqr');
  if (qr) gsap.from(qr, { scale: .8, opacity: 0, rotate: -4, duration: 1.2, ease: 'expo.out', immediateRender: false, scrollTrigger: { trigger: qr, start: 'top 88%', once: true } });
});
