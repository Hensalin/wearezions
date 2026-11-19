/* extras: YouTube wall, floating vectors, progress, magnetic buttons */
(function () {
  'use strict';
  var films = window.WAZ_FILMS || [];
  var bento = document.getElementById('bento');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  if (bento && films.length) {
    bento.innerHTML = films.map(function (f, i) {
      return '<div class="tile" role="button" tabindex="0" data-i="' + i + '" aria-label="Play ' + esc(f.title) + '">' +
        '<img src="https://i.ytimg.com/vi/' + esc(f.id) + '/maxresdefault.jpg" data-hq="https://i.ytimg.com/vi/' + esc(f.id) + '/hqdefault.jpg" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' +
        '<span class="tile__p"><i class="bi bi-play-fill"></i></span>' +
        '<div class="tile__t"><small>' + esc(f.tag || 'Film') + '</small><h3>' + esc(f.title) + '</h3></div></div>';
    }).join('');
    bento.addEventListener('error', function (e) {
      var t = e.target; if (t.tagName === 'IMG' && t.dataset.hq && t.src.indexOf('maxres') > -1) t.src = t.dataset.hq;
    }, true);
    // maxresdefault returns a tiny grey placeholder (120px wide) when missing
    bento.addEventListener('load', function (e) {
      var t = e.target; if (t.tagName === 'IMG' && t.naturalWidth && t.naturalWidth <= 120 && t.dataset.hq) t.src = t.dataset.hq;
    }, true);
    function open(el) { if (window.WAZ_openLb) window.WAZ_openLb('film', +el.dataset.i); }
    bento.addEventListener('click', function (e) { var t = e.target.closest('.tile'); if (t) open(t); });
    bento.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('tile')) { e.preventDefault(); open(e.target); } });
  }


  // featured message: the latest real We Are Zion reel
  var reels = window.WAZ_REELS || [], feat = document.getElementById('feat');
  if (feat && reels.length) {
    var r = reels[0];
    feat.innerHTML = '<span class="feat__img"><img src="assets/images/reels/' + esc(r.code) + '.jpg" data-fallback="' + esc(r.remote || '') + '" alt="" loading="lazy" referrerpolicy="no-referrer"><i class="bi bi-play-fill"></i></span>' +
      '<span class="feat__t"><small>Latest message</small><b>' + esc(r.title) + '</b><span>Watch the reel</span></span>';
    feat.setAttribute('aria-label', 'Play latest message: ' + r.title);
    feat.hidden = false;
    feat.addEventListener('click', function () { if (window.WAZ_openLb) window.WAZ_openLb('reel', 0); });
  }
  var root = document.documentElement;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || root.classList.contains('no-js')) return;
  gsap.registerPlugin(ScrollTrigger);

  // scroll progress
  var bar = document.getElementById('prog');
  if (bar) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (s) { bar.style.transform = 'scaleX(' + s.progress.toFixed(4) + ')'; } });

  // floating vectors: parallax drift + slow spin
  document.querySelectorAll('[data-float]').forEach(function (el) {
    var host = el.closest('section') || el.parentElement;
    gsap.to(el, { y: +el.dataset.float, ease: 'none', scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (el.hasAttribute('data-spin')) gsap.to(el, { rotation: 180, ease: 'none', scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // bento: staggered rise + image parallax
  var tiles = gsap.utils.toArray('.tile');
  if (tiles.length) {
    ScrollTrigger.batch(tiles, {
      start: 'top 90%', once: true,
      onEnter: function (b) { gsap.fromTo(b, { y: 70, opacity: 0, scale: .94 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', stagger: .09, overwrite: true }); }
    });
    gsap.set(tiles, { opacity: 0 });
    tiles.forEach(function (t) {
      var im = t.querySelector('img');
      gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    ScrollTrigger.addEventListener('refresh', function () {});
  }

  // magnetic buttons (fine pointers only)
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.pill,.nav__cta').forEach(function (b) {
      var qx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' }), qy = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener('mouseleave', function () { qx(0); qy(0); });
    });
  }
})();

/* SIGNAL-style warped type + scroll-lit paragraphs */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function letters(el) {
    var t = el.textContent.replace(/\s/g, ' '), out = [];
    el.textContent = '';
    for (var k = 0; k < t.length; k++) { var i = document.createElement('i'); i.className = 'wl'; i.textContent = t[k]; el.appendChild(i); out.push(i); }
    return out;
  }
  var groups = [];
  function addGroup(host, els, amp, rot, speed, phase) {
    var ls = []; els.forEach(function (e) { ls = ls.concat(letters(e)); });
    var g = { host: host, ls: ls, amp: amp, rot: rot, speed: speed, phase: phase || 0, on: true };
    groups.push(g);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { g.on = en[0].isIntersecting; }, { rootMargin: '100px' }).observe(host);
  }
  var hero = document.querySelector('.hero__words');
  if (hero) document.querySelectorAll('.hero__row').forEach(function (row, i) { addGroup(row, [row.firstElementChild], .11, 7, .55, i * 2.2); });
  document.querySelectorAll('[data-warp]').forEach(function (w) { addGroup(w, [w], .1, 6, .45, +(w.dataset.phase || 0)); w.innerHTML += w.innerHTML; });
  // re-collect footer letters after duplication
  groups.forEach(function (g) { if (g.host.hasAttribute('data-warp')) g.ls = [].slice.call(g.host.querySelectorAll('.wl')); });

  function frame(now) {
    var vw = innerWidth, t = reduce ? 0 : now / 1000;
    for (var gi = 0; gi < groups.length; gi++) {
      var g = groups[gi]; if (!g.on) continue;
      var fs = g.fs || (g.fs = parseFloat(getComputedStyle(g.ls[0]).fontSize) || 100);
      var n = g.ls.length, rs = g.rs || (g.rs = new Array(n));
      for (var k = 0; k < n; k++) rs[k] = g.ls[k].getBoundingClientRect();   // all reads first
      for (var k2 = 0; k2 < n; k2++) {                                       // then all writes
        var r = rs[k2];
        if (r.right < -fs || r.left > vw + fs) continue;
        var x = (r.left + r.width / 2) / vw, a = x * Math.PI * 1.6 + g.phase + t * g.speed;
        g.ls[k2].style.transform = 'translateY(' + (Math.sin(a) * g.amp * fs).toFixed(1) + 'px) rotate(' + (Math.cos(a) * g.rot).toFixed(2) + 'deg) scaleY(' + (1 + Math.sin(a + 1) * .12).toFixed(3) + ')';
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  if (groups.length) requestAnimationFrame(frame);
  if (reduce) setTimeout(function () { requestAnimationFrame(frame); }, 400);

  // scroll-lit words
  var lit = document.querySelectorAll('[data-lit]');
  if (!lit.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || document.documentElement.classList.contains('no-js')) return;
  lit.forEach(function (el) {
    var words = [];
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
            else { var s = document.createElement('span'); s.className = 'lw'; s.textContent = p; frag.appendChild(s); words.push(s); }
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
    gsap.to(words, { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 40%', scrub: true } });
  });
})();

/* facts counters (real numbers only) */
(function () {
  'use strict';
  var els = document.querySelectorAll('.stat__i b');
  if (!els.length) return;
  var src = { reels: (window.WAZ_REELS || []).length, films: (window.WAZ_FILMS || []).length };
  els.forEach(function (b) {
    var n = b.dataset.count ? +b.dataset.count : src[b.dataset.countFrom];
    if (!n) return; b.dataset.n = n; b.textContent = n;
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || document.documentElement.classList.contains('no-js')) return;
  els.forEach(function (b) {
    var n = +b.dataset.n; if (!n) return; var o = { v: 0 };
    ScrollTrigger.create({ trigger: b, start: 'top 90%', once: true, onEnter: function () {
      gsap.to(o, { v: n, duration: 1.8, ease: 'power2.out', onUpdate: function () { b.textContent = Math.round(o.v); } });
    } });
    b.textContent = 0;
  });
})();

/* hero mouse parallax + full-bleed band parallax */
(function () {
  'use strict';
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || document.documentElement.classList.contains('no-js')) return;
  var img = document.getElementById('heroImg'), title = document.querySelector('.hero__date');
  if (img && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var qx = gsap.quickTo(img, 'x', { duration: 1.2, ease: 'power3' }), qy = gsap.quickTo(img, 'y', { duration: 1.2, ease: 'power3' });
    window.addEventListener('mousemove', function (e) { qx((e.clientX / innerWidth - .5) * -28); qy((e.clientY / innerHeight - .5) * -18); });
  }
  var bi = document.querySelector('.bleed__img');
  if (bi) gsap.fromTo(bi, { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '.bleed', start: 'top bottom', end: 'bottom top', scrub: true } });
})();

/* closing CTA video: play only while visible, respect reduced motion / data saver */
(function () {
  var v = document.getElementById('ctaVideo'); if (!v) return;
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sd = navigator.connection && navigator.connection.saveData;
  v.muted = true;
  if (rm || sd) { v.removeAttribute('autoplay'); v.pause(); return; }
  if (!('IntersectionObserver' in window)) { v.play && v.play().catch(function () {}); return; }
  new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
  }, { threshold: .15 }).observe(v);
})();

/* Sunday + Vision: staggered card entrance and background parallax */
(function () {
  if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  [['.sun', '.sun__card, .sun__where'], ['.vis', '.vis__card']].forEach(function (p) {
    var sec = document.querySelector(p[0]); if (!sec) return;
    var items = sec.querySelectorAll(p[1]);
    if (items.length) gsap.from(items, { y: 40, opacity: 0, duration: .9, ease: 'expo.out', stagger: .1, clearProps: 'transform,opacity', scrollTrigger: { trigger: sec, start: 'top 80%', once: true } });
  });
})();

/* hover-to-play: reels use a local mp4 if present; films play muted from YouTube */
(function () {
  return; /* thumbnails only: videos open on click (lightbox) */
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  var reels = window.WAZ_REELS || [], films = window.WAZ_FILMS || [];
  function stop(card) {
    var m = card.querySelector('.hv-media'); if (m) m.remove();
    card.classList.remove('is-playing','has-embed'); card._hv = 0;
  }
  function start(card) {
    if (card._hv) return; card._hv = 1;
    var i = +card.dataset.i, el;
    if (card.dataset.kind === 'film') {
      var f = films[i]; if (!f || !/^https?:$/.test(location.protocol)) { card._hv = 0; return; }
      el = document.createElement('iframe');
      el.src = 'https://www.youtube.com/embed/' + encodeURIComponent(f.id) + '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + encodeURIComponent(f.id) + '&playsinline=1&modestbranding=1&rel=0&disablekb=1';
      el.allow = 'autoplay; encrypted-media'; el.tabIndex = -1; el.setAttribute('aria-hidden', 'true');
      el.className = 'hv-media hv-frame';
      card.insertBefore(el, card.querySelector('img').nextSibling);
      card.classList.add('is-playing');
    } else {
      var r = reels[i]; if (!r || card.querySelector('video.rv') || card._none) { card._hv = 0; return; }
      el = document.createElement('video');
      el.className = 'hv-media'; el.muted = !window.__wazSound; el.loop = true; el.playsInline = true; el.setAttribute('aria-hidden', 'true');
      el.src = r.mp4;
      el.addEventListener('playing', function () { if (card._hv) card.classList.add('is-playing'); });
      el.addEventListener('error', function () {
        el.remove();
        if (!card._hv || card.querySelector('.hv-embed')) return;
        var f = document.createElement('iframe');
        f.className = 'hv-media hv-embed'; f.title = 'Reel player';
        f.src = 'https://www.instagram.com/reel/' + encodeURIComponent(r.code) + '/embed/';
        f.allow = 'autoplay; encrypted-media; fullscreen'; f.loading = 'eager';
        card.insertBefore(f, card.querySelector('.reel__thumb').nextSibling);
        card.classList.add('has-embed');
      });
      card.insertBefore(el, card.querySelector('.reel__thumb').nextSibling);
      var p = el.play(); if (p && p.catch) p.catch(function () {});
    }
  }
  /* the reel in the centre of the screen plays by itself (muted) */
  var hovered = null, centre = null;
  function pickCentre() {
    var wrap = document.getElementById('reels-view'); if (!wrap) return;
    var r = wrap.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) { if (centre && centre !== hovered) stop(centre); centre = null; return; }
    var mid = innerWidth / 2, best = null, bd = 1e9;
    wrap.querySelectorAll('.reel').forEach(function (c) {
      var b = c.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - mid);
      if (d < bd) { bd = d; best = c; }
    });
    if (best !== centre) { if (centre && centre !== hovered) stop(centre); centre = best; if (best && !hovered) start(best); }
  }
  setInterval(pickCentre, 600);
  document.addEventListener('mouseover', function (ev) {
    var c = ev.target.closest && ev.target.closest('.reel,.film');
    if (c && !c.contains(ev.relatedTarget)) { hovered = c; start(c); }
  });
  document.addEventListener('mouseout', function (ev) {
    var c = ev.target.closest && ev.target.closest('.reel,.film');
    if (c && !c.contains(ev.relatedTarget)) { if (hovered === c) hovered = null; if (c === centre) return; stop(c); }
  });
  document.addEventListener('mouseover', function (ev) {
    var c = ev.target.closest && ev.target.closest('.reel,.film');
    if (c && !c.contains(ev.relatedTarget)) start(c);
  });
  document.addEventListener('mouseout', function (ev) {
    var c = ev.target.closest && ev.target.closest('.reel,.film');
    if (c && !c.contains(ev.relatedTarget) && c !== centre) stop(c);
  });
})();

/* reels: autoplay (muted, looping) whenever a card is on screen, if its mp4 exists */
(function () {
  return; /* disabled: only the centre card and the hovered card play */
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var sd = navigator.connection && navigator.connection.saveData; if (sd) return;
  var reels = window.WAZ_REELS || [];
  function attach() {
    var cards = document.querySelectorAll('.reel[data-kind="reel"]'); if (!cards.length) return;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var c = x.target, v = c.querySelector('video.rv');
        if (x.isIntersecting && x.intersectionRatio > .5) {
          if (c._none) return;
          if (!v) {
            var r = reels[+c.dataset.i]; if (!r) return;
            v = document.createElement('video'); v.className = 'hv-media rv';
            v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('aria-hidden', 'true');
            v.src = r.mp4;
            v.addEventListener('playing', function () { c.classList.add('is-playing'); });
            v.addEventListener('error', function () { c._none = 1; v.remove(); c.classList.remove('is-playing'); });
            c.insertBefore(v, c.querySelector('.reel__thumb').nextSibling);
          }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (v) { v.pause(); }
      });
    }, { threshold: [0, .5, 1] });
    cards.forEach(function (c) { io.observe(c); });
  }
  if (document.readyState === 'complete') attach(); else window.addEventListener('load', attach);
})();

/* light / dark switch (remembered) */
(function () {
  var b = document.getElementById('themeBtn'); if (!b) return;
  var root = document.documentElement;
  function cur() { return root.getAttribute('data-theme') || 'light'; }
  b.addEventListener('click', function () {
    var n = cur() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', n);
    try { localStorage.setItem('waz-theme', n); } catch (e) {}
    b.setAttribute('aria-pressed', n === 'dark');
  });
})();

/* Church Online: on http(s) play inline; from a local file open YouTube (embeds are blocked there) */
(function () {
  var a = document.getElementById('onlinePoster'); if (!a) return;
  if (!/^https?:$/.test(location.protocol)) return;
  a.addEventListener('click', function (ev) {
    ev.preventDefault();
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube.com/embed/cLp82HmG378?start=7&autoplay=1&rel=0&modestbranding=1&playsinline=1';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
    f.title = 'REKINDLE - FRAGRANT FAITH ~ PART 3 | We Are Zion';
    f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
    a.parentNode.replaceChild(f, a);
  });
})();


/* reels: sound on / off button on every card (muted by default) */
(function () {
  window.__wazSound = false;
  function sync() {
    document.querySelectorAll('.reel video.hv-media').forEach(function (v) { v.muted = !window.__wazSound; });
    document.querySelectorAll('.reel__snd').forEach(function (b) {
      b.setAttribute('aria-pressed', window.__wazSound ? 'true' : 'false');
      b.setAttribute('aria-label', window.__wazSound ? 'Mute reel' : 'Turn sound on');
      b.innerHTML = '<i class="bi ' + (window.__wazSound ? 'bi-volume-up-fill' : 'bi-volume-mute-fill') + '"></i>';
    });
  }
  function add() {
    document.querySelectorAll('.reel[data-kind="reel"]').forEach(function (c) {
      if (c.querySelector('.reel__snd')) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'reel__snd';
      ['click', 'mousedown', 'pointerdown', 'touchstart'].forEach(function (e) { b.addEventListener(e, function (ev) { ev.stopPropagation(); }); });
      b.addEventListener('click', function (ev) { ev.preventDefault(); window.__wazSound = !window.__wazSound; sync(); });
      c.appendChild(b);
    });
    sync();
  }
  function init() { add(); setInterval(function () { add(); document.querySelectorAll('.reel video.hv-media').forEach(function (v) { if (v.muted === window.__wazSound) v.muted = !window.__wazSound; }); }, 800); }
  if (document.readyState === 'complete') init(); else window.addEventListener('load', init);
})();
