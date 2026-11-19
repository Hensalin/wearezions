/* Live content: latest YouTube uploads + Instagram reels, and the "share a thought" section.
   Runs after reels-data.js and before script.js so cached new items are in the galleries on load. */
(function () {
  var C = window.WAZ_CONFIG || {};
  function load(k) { try { var d = JSON.parse(localStorage.getItem(k)); return d && d.items ? d : null; } catch (e) { return null; } }
  function save(k, items) { try { localStorage.setItem(k, JSON.stringify({ t: Date.now(), items: items })); } catch (e) {} }
  function fresh(d, mins) { return d && Date.now() - d.t < mins * 60000; }
  var YT = 'waz-yt-v1', IG = 'waz-ig-v1';

  /* ---- merge helpers ---- */
  function mergeFilms(items) {
    var have = {}; (window.WAZ_FILMS || []).forEach(function (f) { have[f.id] = 1; });
    var add = items.filter(function (i) { return !have[i.id]; }).map(function (i) { return { id: i.id, title: i.title, tag: 'Latest' }; });
    window.WAZ_FILMS = add.concat(window.WAZ_FILMS || []);
  }
  function mergeReels(items) {
    var list = window.WAZ_REELS || [], idx = {}; list.forEach(function (r, i) { idx[r.code] = i; });
    var add = [];
    items.forEach(function (n) { if (idx[n.code] != null) { if (n.mp4) list[idx[n.code]].mp4 = n.mp4; if (n.remote) list[idx[n.code]].remote = n.remote; } else add.push(n); });
    window.WAZ_REELS = add.concat(list);
  }

  /* ---- YouTube ---- */
  var ytc = load(YT); if (ytc) mergeFilms(ytc.items);
  var latest = ytc && ytc.items[0];
  function ytId(link) { var m = /[?&]v=([\w-]{11})/.exec(link || '') || /youtu\.be\/([\w-]{11})/.exec(link || ''); return m && m[1]; }
  function applyLatest(it) {
    if (!it) return; latest = it;
    function run() {
      var a = document.getElementById('onlinePoster');
      if (a) {
        a.href = 'https://www.youtube.com/watch?v=' + it.id; a.setAttribute('aria-label', 'Play: ' + it.title);
        var img = a.querySelector('img'); if (img) { img.src = 'https://i.ytimg.com/vi/' + it.id + '/maxresdefault.jpg'; img.setAttribute('data-fallback', 'https://i.ytimg.com/vi/' + it.id + '/hqdefault.jpg'); img.alt = it.title; img.onerror = function () { img.onerror = null; img.src = 'https://i.ytimg.com/vi/' + it.id + '/hqdefault.jpg'; }; }
        var cap = a.querySelector('.online__cap'); if (cap) cap.textContent = it.title;
      }
      if (window.__tbPaint) window.__tbPaint();
      var tp = document.getElementById('thPoster');
      if (tp && !tp.querySelector('iframe')) {
        tp.href = 'https://www.youtube.com/watch?v=' + it.id; tp.setAttribute('aria-label', 'Play: ' + it.title);
        var ti = tp.querySelector('img'); if (ti) { ti.src = 'https://i.ytimg.com/vi/' + it.id + '/maxresdefault.jpg'; ti.alt = it.title; ti.onerror = function () { ti.onerror = null; ti.src = 'https://i.ytimg.com/vi/' + it.id + '/hqdefault.jpg'; }; }
        var tc = document.getElementById('thCap'); if (tc) tc.textContent = it.title;
      }
      var l = document.getElementById('thLatest');
      if (l) { l.href = 'https://www.youtube.com/watch?v=' + it.id; l.querySelector('b').textContent = it.title; l.hidden = false; }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  }
  if (latest) applyLatest(latest);
  if (C.youtubeChannelId && !fresh(ytc, 20)) {
    var feed = 'https://www.youtube.com/feeds/videos.xml?channel_id=' + C.youtubeChannelId;
    fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var items = (j.items || []).map(function (i) { return { id: ytId(i.link) || (i.guid || '').replace('yt:video:', ''), title: i.title }; }).filter(function (i) { return i.id; });
        if (!items.length) return; save(YT, items); applyLatest(items[0]);
      }).catch(function () {});
  } else if (latest) { /* cache still fresh */ }

  /* ---- Instagram (via Behold-style JSON feed) ---- */
  var igc = load(IG); if (igc) mergeReels(igc.items);
  function mapIG(j) {
    var posts = (j && (j.posts || j.items || j)) || []; if (!Array.isArray(posts)) return [];
    return posts.filter(function (p) { return /VIDEO|REEL/i.test(p.mediaType || p.media_type || '') && (p.mediaUrl || p.media_url); }).map(function (p) {
      var link = p.permalink || '', m = /\/(?:reel|p)\/([\w-]+)/.exec(link); var cap = p.caption || '';
      return { code: m ? m[1] : String(p.id), date: (p.timestamp || '').slice(0, 10), title: (cap.split('\n')[0] || 'New reel').slice(0, 90), caption: cap,
        remote: p.thumbnailUrl || p.thumbnail_url || (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) || '', mp4: p.mediaUrl || p.media_url };
    });
  }
  if (C.instagramFeed && !fresh(igc, 20)) {
    fetch(C.instagramFeed).then(function (r) { return r.json(); }).then(function (j) { var it = mapIG(j); if (it.length) save(IG, it); }).catch(function () {});
  }

  /* ---- Instagram via our own server (official Instagram API): GET /api/instagram/reels ---- */
  function mapApi(j) {
    return ((j && j.items) || []).map(function (p) {
      var cap = p.caption || '';
      return { code: p.code, date: (p.timestamp || '').slice(0, 10), title: (cap.split('\n')[0] || 'New reel').slice(0, 90), caption: cap, remote: p.thumbnail || '' };
    }).filter(function (p) { return p.code; });
  }
  if (C.instagramApi) {
    var base = C.instagramApi === 'same' ? '' : String(C.instagramApi).replace(/\/$/, '');
    var busy = false;
    var pull = function () {
      if (busy || document.hidden || !/^https?:$/.test(location.protocol)) return; busy = true;
      fetch(base + '/api/instagram/reels').then(function (r) { return r.json(); }).then(function (j) {
        var it = mapApi(j); if (!it.length) return;
        var before = (window.WAZ_REELS || []).map(function (r) { return r.code; }).join();
        save(IG, it); mergeReels(it);
        if ((window.WAZ_REELS || []).map(function (r) { return r.code; }).join() !== before && window.WAZ_refreshReels) window.WAZ_refreshReels();
      }).catch(function () {}).then(function () { busy = false; });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pull); else setTimeout(pull, 1500);
    setInterval(pull, 30 * 60 * 1000);
  }

  /* ---- Thought bubbles + video + form ---- */
  function thoughts() {
    var sec = document.getElementById('thoughts'); if (!sec) return;
    var box = document.getElementById('tbBubbles'), open = document.getElementById('tbOpen'), MY = 'waz-my-thoughts';
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    /* video: play inline when the site is online, otherwise open YouTube */
    var poster = document.getElementById('thPoster');
    if (poster) poster.addEventListener('click', function (e) {
      if (!/^https?:$/.test(location.protocol)) return;
      var m = /[?&]v=([\w-]{11})/.exec(poster.href); if (!m) return; e.preventDefault();
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0&modestbranding=1';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true; f.title = 'Latest message';
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:5;background:#000';
      poster.appendChild(f);
    });

    /* question deck: tap the card to deal the next question */
    /* the first question follows the latest YouTube video automatically; the rest are evergreen
       (or set your own with weeklyQuestions in config.js) */
    var EVER = ['What is one thing from this message you will do this week?', 'Who needs to hear what you heard today?', 'What is God asking you to let go of?', 'What are you thankful for after this message?'];
    var QS = [];
    function buildQs() {
      var first = latest && latest.title ? 'What did God say to you through \u201c' + latest.title.replace(/\s*\|.*$/, '').trim() + '\u201d?' : 'What did God say to you through this week\u2019s message?';
      QS = [first].concat(C.weeklyQuestions && C.weeklyQuestions.length ? C.weeklyQuestions : EVER);
    }
    buildQs();
    var card = document.getElementById('tbCard'), qi = 0, dealing = false;
    function paint() { buildQs(); if (qi >= QS.length) qi = 0; document.getElementById('tbCardT').textContent = QS[qi]; document.getElementById('tbCardN').textContent = 'Question ' + (qi + 1) + ' of ' + QS.length; }
    window.__tbPaint = function () { if (!dealing) paint(); };
    paint();
    if (card) card.addEventListener('click', function () {
      if (dealing) return; dealing = true; card.classList.add('out');
      setTimeout(function () { qi = (qi + 1) % QS.length; paint(); card.classList.remove('out'); card.classList.add('in'); setTimeout(function () { card.classList.remove('in'); dealing = false; }, 520); }, 380);
    });

    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { e.forEach(function (x) { sec.classList.toggle('in', x.isIntersecting); var v = sec.querySelector('video'); if (v) { if (x.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); } }); }, { threshold: .1 }).observe(sec);

    var form = document.getElementById('thForm'), msg = document.getElementById('thMsg'), cnt = document.getElementById('thCount'), ta = form && form.thought;
    if (!form) return;
    if (ta && cnt) ta.addEventListener('input', function () { cnt.textContent = ta.value.length + ' / 500'; });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (form.website && form.website.value) return;
      var t = (form.thought.value || '').trim(), em = (form.email.value || '').trim();
      var kind = (form.querySelector('input[name="kind"]:checked') || {}).value || 'Thought';
      if (!t) { msg.textContent = 'Please write your message first.'; return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { msg.textContent = 'Please enter a valid email.'; return; }
      var F = C.thoughtForm || {}, full = '[' + kind + '] (Re: ' + QS[qi] + ') ' + t;
      function done() {
        var btn = form.querySelector('.tb__btn'); if (btn) btn.classList.add('fly'); form.classList.add('sending');
        var echo = document.getElementById('tbEcho'); if (echo) echo.textContent = '“' + (t.length > 160 ? t.slice(0, 157) + '…' : t) + '”';
        setTimeout(function () {
          sec.classList.add('sent'); msg.textContent = ''; form.reset(); if (cnt) cnt.textContent = '0 / 500'; if (btn) btn.classList.remove('fly'); form.classList.remove('sending');
        }, 800);
      }
      if (F.action && F.thought && F.email) {
        var body = new URLSearchParams(); body.append(F.thought, full); body.append(F.email, em);
        form.classList.add('busy');
        fetch(F.action, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
          .then(done).catch(function () { msg.textContent = 'Could not send. Please try again.'; }).then(function () { form.classList.remove('busy'); });
      } else {
        var to = F.mailto || 'wearezion.co@gmail.com';
        location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('A ' + kind.toLowerCase() + ' for We Are Zion') + '&body=' + encodeURIComponent(full + '\n\nMy email: ' + em);
        done();
      }
    });
    var again = document.getElementById('thAgain'); if (again) again.addEventListener('click', function () { sec.classList.remove('sent'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', thoughts); else thoughts();
})();
