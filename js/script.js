(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasG = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var motion = !reduce && hasG;
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  if (!motion) root.className = 'no-js'; // everything visible, no hidden initial states

  /* ---------- image fallbacks ---------- */
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (!t || t.tagName !== 'IMG') return;
    if (t.hasAttribute('data-logo')) {
      var s = document.createElement('span');
      s.textContent = 'WE ARE ZION®';
      s.style.cssText = 'font-family:Benzin,Arial,sans-serif;font-weight:700;font-size:22px;letter-spacing:.02em';
      t.replaceWith(s);
    } else if (t.getAttribute('data-fallback')) { var f = t.getAttribute('data-fallback'); t.removeAttribute('data-fallback'); t.src = f; }
    else { t.classList.add('is-broken'); }
  }, true);

  /* ---------- smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95, syncTouch: false });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }
  function scrollToEl(el) {
    if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.6 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    var el = $(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    setMenu(false);
    scrollToEl(el);
  });

  /* ---------- nav + mobile menu ---------- */
  var nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', !open);
    if (lenis) { open ? lenis.stop() : lenis.start(); } else { document.body.style.overflow = open ? 'hidden' : ''; }
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  if (motion) {
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) {
      nav.classList.toggle('is-hidden', s.direction === 1 && s.scroll() > 240 && menu.getAttribute('aria-hidden') !== 'false');
    } });
  }

  /* ---------- text splitting ---------- */
  function splitUnits(el, mode) {
    var text = el.textContent.trim();
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', text);
    el.innerHTML = '';
    var parts = mode === 'chars' ? text.split('') : text.split(/\s+/);
    parts.forEach(function (w, i) {
      var s = document.createElement('span'); s.className = 'split-w'; s.setAttribute('aria-hidden', 'true');
      var n = document.createElement('i'); n.textContent = w === ' ' ? ' ' : w;
      s.appendChild(n); el.appendChild(s);
      if (mode !== 'chars' && i < parts.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return $$('.split-w > i', el);
  }

  /* ---------- countdown to next Sunday 09:30 IST (04:00 UTC) ---------- */
  function nextSunday() {
    var now = Date.now(), d = new Date(now);
    for (var i = 0; i < 8; i++) {
      var t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + i, 4, 0, 0);
      if (new Date(t).getUTCDay() === 0 && t > now) return t;
    }
  }
  var target = nextSunday();
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var cdEls = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  var shortEl = $('[data-countdown="short"]');
  function tickCountdown() {
    var diff = target - Date.now();
    if (diff <= 0) { target = nextSunday(); diff = target - Date.now(); }
    var s = Math.floor(diff / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    if (cdEls.d) { cdEls.d.textContent = d; cdEls.h.textContent = pad(h); cdEls.m.textContent = pad(m); cdEls.s.textContent = pad(sec); }
    if (shortEl) shortEl.textContent = d + 'd ' + pad(h) + 'h ' + pad(m) + 'm ' + pad(sec) + 's';
  }
  var MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var MONL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function fillDate() {
    var d = new Date(target + 19800000); // IST
    var set = function (k, v) { $$('[data-nd="' + k + '"]').forEach(function (e) { e.textContent = v; }); };
    set('mon', MON[d.getUTCMonth()]); set('day', pad(d.getUTCDate())); set('dow', 'SUN');
    set('long', 'Sunday, ' + d.getUTCDate() + ' ' + MONL[d.getUTCMonth()] + ' ' + d.getUTCFullYear());
  }
  tickCountdown(); fillDate(); setInterval(function () { var t0 = target; tickCountdown(); if (t0 !== target) fillDate(); }, 1000);

  /* ---------- hero video (exact wearezion.co hero file) ---------- */
  var vid = $('#heroVideo');
  var saveData = navigator.connection && navigator.connection.saveData;
  function playVid() { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
  if (!vid || !vid.play) { /* hero is an image */ }
  else if (reduce || saveData) { vid.removeAttribute('autoplay'); vid.pause(); vid.preload = 'none'; }
  else {
    playVid();
    new IntersectionObserver(function (en) { en[0].isIntersecting ? playVid() : vid.pause(); }, { threshold: 0.05 }).observe(vid);
  }

  /* ---------- infinite drag loop (belt + reels) ---------- */
  function makeLoop(view, track, o) {
    o = o || {};
    var speed = reduce ? 0 : (o.speed || -40), pos = 0, vel = 0, drag = false, lastX = 0, moved = 0, hover = false, visible = true, setW = 1;
    var originals = $$(':scope > *', track);
    function build() {
      $$('[data-clone]', track).forEach(function (n) { n.remove(); });
      originals = $$(':scope > *:not([data-clone])', track);
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var first = originals[0], last = originals[originals.length - 1];
      setW = last.offsetLeft + last.offsetWidth - first.offsetLeft + gap;
      var sets = Math.ceil(innerWidth / setW) + 1;
      for (var k = 0; k < sets; k++) originals.forEach(function (n) {
        var c = n.cloneNode(true); c.setAttribute('data-clone', ''); c.setAttribute('aria-hidden', 'true');
        $$('a,button', c).forEach(function (a) { a.tabIndex = -1; });
        c.removeAttribute('tabindex');
        track.appendChild(c);
      });
    }
    build();
    function render() { track.style.transform = 'translate3d(' + gsap.utils.wrap(-setW, 0, pos).toFixed(2) + 'px,0,0)'; }
    view.addEventListener('pointerdown', function (e) { if (e.button > 0) return; drag = true; lastX = e.clientX; moved = 0; vel = 0; view.classList.add('is-drag'); });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - lastX; lastX = e.clientX; pos += dx; vel = dx; moved += Math.abs(dx);
    });
    function up() { drag = false; view.classList.remove('is-drag'); }
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    view.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    view.addEventListener('dragstart', function (e) { e.preventDefault(); });
    view.addEventListener('mouseenter', function () { hover = true; });
    view.addEventListener('mouseleave', function () { hover = false; });
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { rootMargin: '200px' }).observe(view);
    var rs; window.addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(function () { build(); if (o.onBuild) o.onBuild(); }, 200); });
    gsap.ticker.add(function (t, dt) {
      if (!visible) return;
      if (!drag) {
        pos += vel * dt / 16.67; vel *= 0.94; if (Math.abs(vel) < 0.05) vel = 0;
        if (!hover && !(o.isPaused && o.isPaused())) pos += speed * dt / 1000;
      }
      render();
      if (o.onFrame) o.onFrame(vel, -gsap.utils.wrap(-setW, 0, pos) / setW, drag);
    });
    return { build: build };
  }

  /* ---------- belt (fisheye) ---------- */
  var beltView = $('#belt');
  if (beltView && hasG) {
    var beltTrack = $('.belt__track', beltView);
    var beltCards = [];
    var collect = function () { beltCards = $$('.bcard', beltTrack); };
    makeLoop(beltView, beltTrack, {
      speed: -38, onBuild: collect,
      onFrame: function () {
        var vw = innerWidth, cx = vw / 2;
        for (var i = 0; i < beltCards.length; i++) {
          var r = beltCards[i].getBoundingClientRect();
          if (r.right < -100 || r.left > vw + 100) continue;
          var d = Math.abs((r.left + r.width / 2 - cx) / vw);
          var sd = (r.left + r.width / 2 - cx) / vw; beltCards[i].style.transform = 'perspective(1100px) rotateY(' + (-sd * 58).toFixed(2) + 'deg) scale(' + (1 - Math.min(0.2, d * 0.3)).toFixed(3) + ') translateY(' + (d * 40).toFixed(1) + 'px)';
        }
      }
    });
    collect();
  }

  /* ---------- reels wall + films (real @wearezion.in content) ---------- */
  var reels = window.WAZ_REELS || [], films = window.WAZ_FILMS || [];
  var lb = $('#lb'), lbOpen = false, lbList = [], lbI = 0;
  var cur = $('#reelCursor');
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmtDate(d) { try { var x = new Date(d); return isNaN(x) ? '' : x.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch (e) { return ''; } }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function shortTitle(r) { var t = (r.title || r.caption || '').replace(/\s+/g, ' ').trim(); return t.length > 70 ? t.slice(0, 67) + '…' : t; }

  function buildReels() {
    var rtrack = $('#reels-track'); if (!rtrack || !reels.length) return null;
    var cnt = $('#reelsCount'); if (cnt) cnt.textContent = reels.length;
    rtrack.innerHTML = reels.map(function (r, i) {
      return '<div class="reel" role="button" tabindex="0" data-kind="reel" data-i="' + i + '" aria-label="Play reel: ' + esc(shortTitle(r)) + '">' +
        '<img class="reel__thumb" src="assets/images/reels/' + esc(r.code) + '.jpg" data-fallback="' + esc(r.remote || '') + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' +
        '<span class="reel__shade"></span>' +
        '<div class="reel__top"><span class="reel__n">' + pad2(i + 1) + '</span><span><i class="bi bi-instagram"></i></span></div>' +
        '<span class="reel__play"><i class="bi bi-play-fill"></i></span>' +
        '<div class="reel__bot"><h3>' + esc(shortTitle(r)) + '</h3><small>' + esc(fmtDate(r.date)) + '</small></div></div>';
    }).join('');
    return rtrack;
  }
  function buildFilms() {
    var ft = $('#films-track'); if (!ft || !films.length) return null;
    ft.innerHTML = films.map(function (f, i) {
      return '<div class="film" role="button" tabindex="0" data-kind="film" data-i="' + i + '" aria-label="Watch on YouTube: ' + esc(f.title) + '">' +
        '<img src="https://i.ytimg.com/vi/' + esc(f.id) + '/hqdefault.jpg" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' +
        '<span class="reel__play"><i class="bi bi-play-fill"></i></span><span>' + esc(f.title) + ' <i class="bi bi-youtube" style="color:#e62117"></i></span></div>';
    }).join('');
    return ft;
  }

  function openLb(kind, i) {
    if (kind === 'film' && films.length) {
      var ff = films[(i + films.length) % films.length];
      window.open('https://www.youtube.com/watch?v=' + encodeURIComponent(ff.id), '_blank', 'noopener');
      return;
    }
    if (!lb) return;
    lbList = kind === 'film' ? films : reels; lbI = (i + lbList.length) % lbList.length;
    var it = lbList[lbI], stage = $('#lbStage');
    var isFilm = kind === 'film';
    stage.className = 'lb__stage' + (isFilm ? ' is-film' : '');
    stage.innerHTML = '<iframe title="' + esc(isFilm ? it.title : shortTitle(it)) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="eager" src="' +
      (isFilm ? 'https://www.youtube.com/embed/' + encodeURIComponent(it.id) + '?autoplay=1&rel=0&modestbranding=1' : 'https://www.instagram.com/reel/' + encodeURIComponent(it.code) + '/embed/') + '"></iframe>';
    $('#lbDate').textContent = isFilm ? (it.tag || 'Film') : fmtDate(it.date);
    $('#lbTitle').textContent = isFilm ? it.title : shortTitle(it);
    $('#lbText').textContent = isFilm ? '' : (it.caption || '').replace(/\s+/g, ' ').slice(0, 220);
    var l = $('#lbLink'); l.href = isFilm ? 'https://www.youtube.com/watch?v=' + it.id : 'https://www.instagram.com/reel/' + it.code + '/'; l.firstChild.nodeValue = isFilm ? 'Open on YouTube ' : 'Open on Instagram ';
    $('#lbIdx').textContent = pad2(lbI + 1) + ' / ' + pad2(lbList.length);
    lb.dataset.kind = kind;
    if (!lbOpen) { lb.hidden = false; lbOpen = true; if (lenis) lenis.stop(); document.documentElement.style.overflow = 'hidden'; if (hasG) gsap.fromTo('.lb__x,.lb__nav', { scale: 0 }, { scale: 1, duration: .5, ease: 'back.out(2)', stagger: .06 }); }
    $('#lbClose').focus();
  }
  window.WAZ_openLb = openLb;
  var lastTrigger = null;
  function closeLb() {
    if (!lbOpen) return; lbOpen = false; lb.hidden = true; $('#lbStage').innerHTML = '';
    if (lenis) lenis.start(); document.documentElement.style.overflow = '';
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }
  if (lb) {
    $('#lbClose').addEventListener('click', closeLb);
    $('#lbBg').addEventListener('click', closeLb);
    $('#lbPrev').addEventListener('click', function () { openLb(lb.dataset.kind, lbI - 1); });
    $('#lbNext').addEventListener('click', function () { openLb(lb.dataset.kind, lbI + 1); });
    document.addEventListener('keydown', function (e) {
      if (!lbOpen) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') openLb(lb.dataset.kind, lbI - 1);
      else if (e.key === 'ArrowRight') openLb(lb.dataset.kind, lbI + 1);
    });
  }

  function wireView(view) {
    if (!view) return;
    view.addEventListener('click', function (e) {
      var c = e.target.closest('[data-kind]'); if (!c) return;
      lastTrigger = c; openLb(c.dataset.kind, +c.dataset.i);
    });
    view.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-kind]')) { e.preventDefault(); lastTrigger = e.target; openLb(e.target.dataset.kind, +e.target.dataset.i); }
    });
    if (!cur || !hasG || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    var cx = gsap.quickTo(cur, 'x', { duration: .35, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .35, ease: 'power3' });
    gsap.set(cur, { x: -100, y: -100 });
    view.addEventListener('mouseenter', function () { cur.classList.add('is-on'); gsap.to(cur, { scale: 1, duration: .4, ease: 'back.out(2)' }); });
    view.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); gsap.to(cur, { scale: .3, duration: .3 }); });
    view.addEventListener('mousemove', function (e) {
      cx(e.clientX); cy(e.clientY);
      var on = !!e.target.closest('[data-kind]');
      cur.textContent = on ? 'PLAY' : 'DRAG';
    });
  }

  var rtrack = buildReels(), ftrack = buildFilms();
  var rview = $('#reels-view'), fview = $('#films-view');
  wireView(rview); wireView(fview);
  if (hasG) {
    var bar = $('#reelsBar');
    var rloop = null;
    if (rview && rtrack) rloop = makeLoop(rview, rtrack, {
      speed: -50,
      isPaused: function () { return lbOpen || document.hidden; },
      onFrame: function (vel, prog) {
        rtrack.style.setProperty('--r', gsap.utils.clamp(-4, 4, vel * 0.18).toFixed(2) + 'deg');
        if (bar) bar.style.transform = 'scaleX(' + prog.toFixed(4) + ')';
      }
    });
    /* live refresh: rebuild the reel cards from window.WAZ_REELS (skipped while a reel is open) */
    window.WAZ_refreshReels = function () { if (lbOpen || !rloop) return false; reels = window.WAZ_REELS || reels; var t = buildReels(); if (!t) return false; rloop.build(); return true; };
    if (fview && ftrack) makeLoop(fview, ftrack, { speed: 36, isPaused: function () { return lbOpen || document.hidden; } });
  }

  /* ---------- Bible plans (real YouVersion plans from wearezion.co/bible-plan) ---------- */
  var W = 'https://static.wixstatic.com/media/';
  var plan = function (id, hash, ext, label) { return { id: id, img: W + 'f3a51c_' + hash + '~mv2.' + ext, label: label }; };
  var PLANS = {
    en: [plan(16890, '9822dfd035c54862be732a53db6f15c0', 'jpg', 'English'), plan(17839, '2818291c112842a6931863431adc1e3c', 'png', 'English'), plan(18426, 'c6ba9b5a95d942a985401a58d3de34a7', 'png', 'English'), plan(19243, '1c9c669204524d0fb62e5893ba54b793', 'png', 'Only Jesus'), plan(20792, '337106812f2546cb81670667b0ada584', 'png', 'Overflow'), plan(22345, '8edb2bca360746b69753630f02763bfb', 'png', 'English'), plan(22812, 'e1e7589cc4424a14b01087598c48a978', 'png', 'God With Us')],
    hi: [plan(21966, 'c7d2ad0039384931b19fb8941c5b10e3', 'jpg', 'Hindi'), plan(16949, 'c982ec24b9c240079faa5dd84af6e536', 'jpg', 'Hindi'), plan(19493, '35423dd2e7ad481da18d9381ef4c2756', 'jpg', 'Hindi')],
    te: [plan(22793, '571f23e4329847939426730d352b3fbc', 'jpg', 'Telugu'), plan(18198, '7406bac87c9e47288c041700dca8435d', 'jpg', 'Telugu'), plan(20733, '7dbcfdb3fe3a4931b9dda198b194439d', 'jpg', 'Telugu'), plan(19746, '032edc3b3ec547e8af2858652bd34268', 'jpg', 'Telugu'), plan(17504, '90807a72bb364071bd7233a647b65fb9', 'jpg', 'Telugu')],
    ta: [plan(23038, 'a188f3496aab4933a424e074d789982e', 'jpg', 'Tamil'), plan(22005, '2442690790a24f37b65971b9289f2abe', 'jpg', 'Tamil')],
    bn: [plan(19686, 'dd1fe26c81ba43ce8ab6d92f41a109e2', 'jpg', 'Bengali'), plan(19767, 'c250aa80c7fb476587dff962ca7d49f6', 'jpg', 'Bengali'), plan(20562, '3946a1d7a803482e82d1d5859b2f74e7', 'jpg', 'Bengali')]
  };
  var NAMES = { en: 'English', hi: 'Hindi', te: 'Telugu', ta: 'Tamil', bn: 'Bengali' };
  var grid = $('#plansGrid');
  function renderPlans(lang) {
    if (!grid) return;
    grid.innerHTML = '';
    PLANS[lang].forEach(function (p) {
      var a = document.createElement('a');
      a.className = 'plan'; a.href = 'https://www.bible.com/reading-plans/' + p.id; a.target = '_blank'; a.rel = 'noopener';
      a.setAttribute('aria-label', NAMES[lang] + ' Bible plan on YouVersion' + (p.label !== NAMES[lang] ? ': ' + p.label : ''));
      var img = new Image(); img.loading = 'lazy'; img.alt = ''; img.src = p.img;
      var s = document.createElement('span'); s.textContent = p.label;
      a.appendChild(img); a.appendChild(s); grid.appendChild(a);
    });
    if (window.__plWire) window.__plWire();
  }
  renderPlans('en');
  var tabs = $$('.tabs button');
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); }); renderPlans(t.dataset.lang); });
    t.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (n !== null) { var tg = tabs[(n + tabs.length) % tabs.length]; tg.focus(); tg.click(); }
    });
  });

  if (!motion || !document.getElementById('heroFrame')) return; /* sub-pages: choreography lives in zion.js */

  /* ============ ANIMATION CHOREOGRAPHY (GSAP + ScrollTrigger) ============ */

  /* hero intro */
  var frame = $('#heroFrame');
  var dateChars = splitUnits($('.hero__date-l1'), 'chars').concat(splitUnits($('.hero__date-l2'), 'chars'));
  gsap.set(frame, { clipPath: 'inset(50% 50% 50% 50%)' });
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero__row span', { yPercent: 70, opacity: 0, duration: 1.5, stagger: 0.18 }, 0)
    .to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0.35)
    .from(dateChars, { yPercent: 115, duration: 1.2, stagger: 0.045 }, 1.0)
    .from('.hero__tag,.hero__sub,.hero__thumb,.hero__live,.hero__count', { opacity: 0, y: 24, duration: 1, stagger: 0.09 }, 1.3);

  /* hero rows: opposing marquees that speed up with scroll */
  var tws = [];
  $$('.hero__row').forEach(function (row) {
    var dir = +row.dataset.dir, sp = row.firstElementChild;
    tws.push(gsap.fromTo(sp, { xPercent: dir < 0 ? 0 : -25 }, { xPercent: dir < 0 ? -25 : 0, duration: 36, ease: 'none', repeat: -1 }));
  });

  /* section marquees */
  $$('.marquee').forEach(function (m, idx) {
    var tr = $('.marquee__track', m), html = tr.innerHTML;
    tr.innerHTML = html + html + html + html;
    tws.push(gsap.fromTo(tr, { xPercent: idx % 2 ? -25 : 0 }, { xPercent: idx % 2 ? 0 : -25, duration: 24, ease: 'none', repeat: -1 }));
  });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) {
    var v = Math.min(5, 1 + Math.abs(s.getVelocity()) / 700);
    tws.forEach(function (t) { t.timeScale(Math.max(t.timeScale(), v)); });
  } });
  gsap.ticker.add(function () { tws.forEach(function (t) { var ts = t.timeScale(); if (ts > 1.001) t.timeScale(ts + (1 - ts) * 0.06); }); });

  /* hero: pin, frame expands to full bleed, wordmark recedes */
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=100%', scrub: true, pin: true, anticipatePin: 1 } })
    .to(frame, { top: 0, left: 0, right: 0, bottom: 0, ease: 'none' }, 0)
    .to('.hero__words', { opacity: 0, scale: 1.12, ease: 'none' }, 0)
    .to('.hero__thumb,.hero__live,.hero__count', { opacity: 0, y: 40, ease: 'none' }, 0)
    .to('.hero__date', { scale: 1.04, transformOrigin: '0 100%', ease: 'none' }, 0);

  /* reveals */
  $$('[data-split]').forEach(function (el) {
    var words = splitUnits(el, 'words');
    gsap.set(words, { yPercent: 115 });
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: function () { gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035 }); } });
  });
  ScrollTrigger.batch('[data-reveal]', { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.09 }); } });
  $$('[data-mask]').forEach(function (el) {
    var img = $('img', el);
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () {
      gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut' });
      gsap.to(img, { scale: 1, duration: 1.8, ease: 'expo.out' });
    } });
    gsap.to(el, { y: el.dataset.lag ? -70 : 30, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* messages: active row */
  $$('.prow').forEach(function (r) {
    ScrollTrigger.create({ trigger: r, start: 'top 62%', end: 'bottom 38%', toggleClass: { targets: r, className: 'is-on' } });
  });

  /* vision: pinned horizontal scroll (desktop/tablet) */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 821px)', function () {
    var track = $('.vision__track');
    if (!track) return;
    gsap.to(track, {
      x: function () { return -(track.scrollWidth - innerWidth); }, ease: 'none',
      scrollTrigger: { trigger: '.vision__pin', start: 'top top', end: function () { return '+=' + (track.scrollWidth - innerWidth); }, pin: true, scrub: true, invalidateOnRefresh: true,
        onUpdate: function (s) { gsap.set('.vision__bar i', { scaleX: s.progress }); } }
    });
  });

  /* panels: pinned crossfade with clip-path wipes */
  var panels = $$('.panel'), dots = $$('.panels__dots i');
  if (panels.length) {
    gsap.set(panels.slice(1), { clipPath: 'inset(100% 0 0 0)' });
    var ptl = gsap.timeline({ scrollTrigger: { trigger: '.panels__pin', start: 'top top', end: '+=' + (panels.length - 1) * 100 + '%', pin: true, scrub: true,
      onUpdate: function (s) { var k = Math.round(s.progress * (panels.length - 1)); dots.forEach(function (d, i) { d.classList.toggle('is-on', i === k); }); } } });
    panels.forEach(function (p, i) {
      if (!i) return;
      ptl.to(p, { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 1 })
         .fromTo($$('.panel__bg img', p), { yPercent: -7 }, { yPercent: 0, ease: 'none', duration: 1 }, '<')
         .from($('.panel__copy', p), { y: 70, opacity: 0, ease: 'none', duration: 0.6 }, '<0.4');
    });
    if (dots[0]) dots[0].classList.add('is-on');
    gsap.from($('.panel__copy', panels[0]), { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.panels__pin', start: 'top 70%', once: true } });
  }

  /* final CTA + footer */
  gsap.from('.cta__ticket', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.cta', start: 'top 75%', once: true } });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
