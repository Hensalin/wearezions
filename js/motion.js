/* We Are Zion · page-wide motion (sub-pages). GSAP + ScrollTrigger.
   - one init guard, skipped for prefers-reduced-motion (the base zion.js reveal still runs)
   - hero title split per page (different composition each), hero label/lead choreography
   - alternating left / right / pop entrances, staggered groups, clip-path photo reveals
   - drawn section dividers, events collage parallax, footer drift, article headings
   - lighter on phones (smaller offsets, no parallax). Never hijacks scroll. */
(function(){
  if (window.__wazMotion) return; window.__wazMotion = 1;
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  /* pause CSS animations in sections that are off screen: less work per frame while scrolling */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(en){ en.forEach(function(e){ e.target.classList.toggle('is-off', !e.isIntersecting); }); }, { rootMargin: '150px 0px' });
    [].slice.call(document.querySelectorAll('main section, section.zhero, section.stat, section.nm, section.reels, section.cta, footer')).forEach(function(el){ io.observe(el); });
  }
  if (!document.body.classList.contains('subpage')) { if (document.getElementById('top') && document.getElementById('statement')) home(); return; }

  var small = window.matchMedia('(max-width: 700px)').matches;
  var X = small ? 22 : 70;
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var isPost = location.pathname.indexOf('/blogs/') > -1;
  var main = document.getElementById('main'); if (!main) return;

  /* ---------- 1 · hero title: split, per-page composition ---------- */
  var VARIANT = { 'about.html':'left', 'church-life.html':'chars', 'missions.html':'right', 'contact.html':'pop', 'links.html':'drop',
    'blog.html':'rise', 'events.html':'rotate', 'vod.html':'chars', 'podcast.html':'left', 'bible-plan.html':'drop' };
  var variant = isPost ? 'rise' : (VARIANT[file] || 'rise');

  function splitTitle(h1){
    var txt = h1.textContent.replace(/\s+/g, ' ').trim(); if (!txt) return;
    h1.setAttribute('aria-label', txt); h1.innerHTML = '';
    var useChars = variant === 'chars' && txt.length <= 30;
    var parts = [], mask = variant !== 'pop';
    txt.split(' ').forEach(function(w, wi, arr){
      var m = document.createElement('span'); m.setAttribute('aria-hidden', 'true');
      m.style.cssText = 'display:inline-block;vertical-align:top;' + (mask ? 'overflow:hidden;padding:.08em .06em .16em;margin:-.08em -.06em -.16em' : '');
      if (useChars) {
        w.split('').forEach(function(ch){ var c = document.createElement('i'); c.textContent = ch; c.style.cssText = 'display:inline-block;font-style:normal;will-change:transform'; m.appendChild(c); parts.push(c); });
      } else {
        var n = document.createElement('i'); n.textContent = w; n.style.cssText = 'display:inline-block;font-style:normal;will-change:transform'; m.appendChild(n); parts.push(n);
      }
      h1.appendChild(m); if (wi < arr.length - 1) h1.appendChild(document.createTextNode(' '));
    });
    h1.removeAttribute('data-reveal'); h1.style.opacity = 1;
    var from, to = { duration: 1.25, ease: 'expo.out', stagger: .09, delay: .12, xPercent: 0, yPercent: 0, x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
    switch (variant) {
      case 'left':   from = { xPercent: -115 }; break;
      case 'right':  from = { xPercent: 115 }; break;
      case 'drop':   from = { yPercent: -115 }; break;
      case 'chars':  from = { yPercent: 125 }; to.stagger = .028; to.duration = 1.1; break;
      case 'rotate': from = { yPercent: 110, rotate: 9, transformOrigin: '0 100%' }; break;
      case 'pop':    from = { scale: .55, y: 36, opacity: 0 }; to.ease = 'back.out(1.7)'; to.stagger = .08; to.duration = 1; break;
      default:       from = { yPercent: 115 };
    }
    gsap.set(parts, from); gsap.to(parts, to);
  }
  if (file !== 'give.html') {
    var h1 = main.querySelector('h1.ph__title, .ph__title');
    if (h1) splitTitle(h1);
  }

  /* hero label / lead / meta / back link: choreographed, not scroll-driven */
  var heroEls = [].slice.call(main.querySelectorAll('.ph [data-reveal], .zpodh [data-reveal]')).filter(function(e){ return !e.matches('h1, .ph__title'); });
  heroEls.forEach(function(el, i){
    el.removeAttribute('data-reveal');
    var isLabel = el.classList.contains('label') || el.classList.contains('zback');
    gsap.fromTo(el, { opacity: 0, x: isLabel ? -28 : 0, y: isLabel ? 0 : 26 }, { opacity: 1, x: 0, y: 0, duration: 1, ease: 'expo.out', delay: .35 + i * .1, clearProps: 'transform' });
  });

  /* ---------- 2 · section entrances: alternate left / right / pop ---------- */
  var SKIP = '.zimg, .zphoto, .zstrip, .zstrip *, .zmarq, .zmarq *';
  var els = [].slice.call(main.querySelectorAll('[data-reveal]')).filter(function(e){ return !e.matches(SKIP) && !e.closest('.ph') && !e.closest('.zpodh'); });
  var sections = [].slice.call(main.querySelectorAll('section.zs'));
  var plan = [];
  els.forEach(function(el){
    var sec = el.closest('section'); var si = Math.max(0, sections.indexOf(sec)); var flip = si % 2 ? -1 : 1;
    var sibs = [].slice.call(el.parentNode.children).filter(function(s){ return s.hasAttribute('data-reveal') && !s.matches(SKIP); });
    var d = { x: 0, y: 40, s: 1 };
    if (sibs.length >= 3) { var k = sibs.indexOf(el) % 3; d = k === 0 ? { x: -X, y: 20, s: 1 } : k === 1 ? { x: 0, y: 64, s: .94 } : { x: X, y: 20, s: 1 }; }
    else if (sibs.length === 2) { d = sibs.indexOf(el) === 0 ? { x: -X, y: 16, s: 1 } : { x: X, y: 16, s: 1 }; }
    else if (el.classList.contains('label') || el.classList.contains('ztitle')) d = { x: -X * flip, y: 18, s: 1 };
    else if (el.classList.contains('zlead') || el.tagName === 'P') d = { x: X * flip, y: 18, s: 1 };
    plan.push([el, d]);
  });
  plan.forEach(function(p){ var el = p[0], d = p[1]; el.removeAttribute('data-reveal'); gsap.set(el, { opacity: 0, x: d.x, y: d.y, scale: d.s }); });
  if (els.length) ScrollTrigger.batch(els, { start: 'top 90%', once: true, onEnter: function(b){
    gsap.to(b, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.1, ease: 'expo.out', stagger: .09, overwrite: true, clearProps: 'transform' });
  } });

  /* ---------- 3 · photos: clip-path mask reveal, direction alternates ---------- */
  [].slice.call(main.querySelectorAll('.zphoto[data-reveal]')).forEach(function(el, i){
    el.removeAttribute('data-reveal');
    var inset = i % 2 ? 'inset(0 0 0 100% round 20px)' : 'inset(0 100% 0 0 round 20px)';
    gsap.set(el, { opacity: 1, clipPath: inset });
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function(){
      gsap.to(el, { clipPath: 'inset(0 0% 0 0% round 20px)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' });
    } });
  });

  /* ---------- 4 · drawn section dividers ---------- */
  sections.forEach(function(sec, i){
    if (sec.classList.contains('zcta') || sec.classList.contains('zmarq')) return;
    var line = document.createElement('i'); line.className = 'zdiv'; line.setAttribute('aria-hidden', 'true');
    line.style.transformOrigin = i % 2 ? '100% 50%' : '0 50%';
    sec.insertBefore(line, sec.firstChild);
    gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 85%', once: true } });
  });

  /* ---------- 5 · page-specific motion ---------- */
  if (file === 'events.html' && !small) {
    var col = main.querySelectorAll('.zev__collage > *');
    [-1, 1, -.6].forEach(function(f, i){ if (col[i]) gsap.fromTo(col[i], { y: 50 * f }, { y: -50 * f, ease: 'none', scrollTrigger: { trigger: '.zev__feat', start: 'top bottom', end: 'bottom top', scrub: true } }); });
  }
  if (file === 'contact.html') {
    var li = main.querySelectorAll('.zs li');
    if (li.length) gsap.from(li, { x: -40, opacity: 0, duration: .9, ease: 'expo.out', stagger: .1, immediateRender: false, scrollTrigger: { trigger: li[0], start: 'top 88%', once: true } });
  }
  if (isPost) {
    var pe = [].slice.call(main.querySelectorAll('.zart__body h2, .zart__body blockquote, .zauthor'));
    pe.forEach(function(el, i){
      var q = el.tagName === 'BLOCKQUOTE' || el.classList.contains('zauthor');
      var f = q ? { opacity: 0, y: 40, scale: .95 } : { opacity: 0, x: i % 2 ? X : -X };
      gsap.set(el, f);
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function(){
        gsap.to(el, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.1, ease: 'expo.out', clearProps: 'transform' });
      } });
    });
  }
  var faq = main.querySelectorAll('.zfaq details');
  if (faq.length) gsap.from(faq, { x: function(i){ return i % 2 ? X : -X; }, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, immediateRender: false, scrollTrigger: { trigger: '.zfaq__l', start: 'top 85%', once: true } });

  /* ---------- 6 · footer drift ---------- */
  var mega = document.querySelector('.footer__mega');
  if (mega && !small) gsap.fromTo(mega, { yPercent: 16 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* images lazy-load and shift layout: re-measure once everything is in */
  window.addEventListener('load', function(){ ScrollTrigger.refresh(); });

  /* ================= homepage: extra motion layered on the existing sections (pinned sections untouched) ================= */
  function home(){
    var sm = window.matchMedia('(max-width: 700px)').matches, X = sm ? 22 : 80;
    var q = function(s){ return [].slice.call(document.querySelectorAll(s)); };
    var once = function(el, from, to, start){
      gsap.set(el, from);
      ScrollTrigger.create({ trigger: el, start: start || 'top 90%', once: true, onEnter: function(){ gsap.to(el, Object.assign({ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform' }, to || {})); } });
    };
    var free = function(e){ return !e.hasAttribute('data-reveal') && !e.closest('.panels, .pl__stick'); };

    /* hero video: slow push-in while you scroll away */
    var hv = document.querySelector('.zhero .zvideo');
    if (hv && !sm) gsap.fromTo(hv, { scale: 1 }, { scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.zhero', start: 'top top', end: 'bottom top', scrub: true } });

    /* big statements: words light up as you scroll */
    q('.stat__big, .about__big').forEach(function(el){
      if (el.children.length) return;
      var t = el.textContent.replace(/\s+/g, ' ').trim(); if (!t) return;
      el.setAttribute('aria-label', t); el.innerHTML = '';
      var ws = t.split(' ').map(function(w, i, a){ var sp = document.createElement('span'); sp.textContent = w; sp.setAttribute('aria-hidden', 'true'); sp.style.opacity = .16; el.appendChild(sp); if (i < a.length - 1) el.appendChild(document.createTextNode(' ')); return sp; });
      el.style.opacity = 1;
      gsap.to(ws, { opacity: 1, ease: 'none', stagger: .12, scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: true } });
    });

    /* section heads: label and title from opposite sides, lead and pill follow */
    ['.reels__head','.belt__head','.sun__head','.vis__head','.vg__head','.about__row','.tb__left'].forEach(function(sel, si){
      var root = document.querySelector(sel); if (!root) return; var flip = si % 2 ? -1 : 1;
      var lab = root.querySelector('.label, .vg__label'), ttl = root.querySelector('h2'), lead = root.querySelector('.reels__lead, .belt__lead, .about__p, .plans__p');
      if (lab && free(lab)) once(lab, { opacity: 0, x: -X * flip }, { duration: 1 });
      if (ttl && free(ttl)) once(ttl, { opacity: 0, x: X * flip, y: 20 });
      if (lead && free(lead)) once(lead, { opacity: 0, y: 36 }, { delay: .12 });
    });

    /* cards: left, up, right in turn */
    [['.stat__row .stat__i', null], ['.vis .vb__c', null], ['.cta__ticket > *', null]].forEach(function(g){
      var els = q(g[0]).filter(free); if (!els.length) return;
      ScrollTrigger.batch(els, { start: 'top 92%', once: true, onEnter: function(b){ gsap.to(b, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.15, ease: 'expo.out', stagger: .12, clearProps: 'transform' }); } });
      els.forEach(function(el, i){ var k = i % 3; gsap.set(el, k === 0 ? { opacity: 0, x: -X } : k === 1 ? { opacity: 0, y: 70, scale: .94 } : { opacity: 0, x: X }); });
    });

    /* final call: ticket pops, buttons rise */
    q('.cta__btns .pill').forEach(function(el, i){ if (free(el)) once(el, { opacity: 0, y: 40, scale: .9 }, { delay: i * .12, ease: 'back.out(1.6)' }, 'top 95%'); });


    /* magnetic buttons + card tilt: pointer devices only */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      q('.pill, .zb1, .zb2, .nav__cta').forEach(function(el){
        el.addEventListener('mousemove', function(e){ var r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .3, duration: .35, ease: 'power3.out', overwrite: 'auto' }); });
        el.addEventListener('mouseleave', function(){ gsap.to(el, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.45)', overwrite: 'auto' }); });
      });
      q('.sun__card, .vb__c').forEach(function(el){
        el.addEventListener('mousemove', function(e){ var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; gsap.to(el, { rotationY: px * 9, rotationX: -py * 9, transformPerspective: 900, duration: .5, ease: 'power3.out', overwrite: 'auto' }); });
        el.addEventListener('mouseleave', function(){ gsap.to(el, { rotationX: 0, rotationY: 0, duration: .9, ease: 'expo.out', overwrite: 'auto' }); });
      });
    }
    window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
  }
})();
