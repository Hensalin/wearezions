/* Video library: search, filters, load more. Data: window.WAZ_VIDEOS = [[id, title, duration], ...] */
(function(){
  var D = window.WAZ_VIDEOS || [];
  function mins(d){ var p = d.split(':').map(Number); return p.length === 3 ? p[0]*60 + p[1] + p[2]/60 : p[0] + p[1]/60; }
  function esc(s){ return s.replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  var items = D.map(function(r){
    var m = mins(r[2]);
    var num = /^\d+\s*[~-]/.test(r[1]);
    return { id: r[0], t: r[1], d: r[2], k: num ? 'podcast' : (m >= 20 ? 'sermon' : 'short') };
  });
  function card(v){
    return '<a class="zvid" href="https://www.youtube.com/watch?v=' + v.id + '" target="_blank" rel="noopener">' +
      '<span class="zvid__img"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg" alt="">' +
      '<i class="bi bi-play-fill"></i></span><h3>' + esc(v.t) + '</h3><span class="zvid__m">' + v.d + '</span></a>';
  }
  /* Podcast page: latest numbered episodes */
  var pod = document.getElementById('podEpisodes');
  if (pod) {
    var eps = items.filter(function(v){ return v.k === 'podcast'; }).slice(0, 12);
    pod.innerHTML = eps.map(card).join('');
  }
  /* VOD page: full library */
  var grid = document.getElementById('libGrid'); if (!grid) return;
  var q = document.getElementById('libQ'), more = document.getElementById('libMore'), count = document.getElementById('libCount');
  var chips = document.querySelectorAll('[data-lib]'), kind = 'all', shown = 0, STEP = 24, list = items;
  function apply(){
    var s = q.value.trim().toLowerCase();
    list = items.filter(function(v){ return (kind === 'all' || v.k === kind) && (!s || v.t.toLowerCase().indexOf(s) > -1); });
    shown = 0; grid.innerHTML = ''; add();
  }
  function add(){
    var next = list.slice(shown, shown + STEP);
    grid.insertAdjacentHTML('beforeend', next.map(card).join(''));
    shown += next.length;
    count.textContent = list.length + ' video' + (list.length === 1 ? '' : 's');
    more.style.display = shown < list.length ? '' : 'none';
    if (!list.length) grid.innerHTML = '<p class="zlead">No videos match. Try another word.</p>';
  }
  q.addEventListener('input', apply);
  more.addEventListener('click', add);
  chips.forEach(function(c){ c.addEventListener('click', function(){
    chips.forEach(function(x){ x.classList.remove('is-on'); }); c.classList.add('is-on'); kind = c.getAttribute('data-lib'); apply();
  }); });
  apply();
})();
