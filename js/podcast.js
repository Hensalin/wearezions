/* Podcast page: searchable grid of square episode covers */
(function(){
  var D = window.WAZ_PODCAST || [], grid = document.getElementById('podGrid'); if (!grid) return;
  var q = document.getElementById('podQ'), more = document.getElementById('podMore'), n = 0, list = D, STEP = 15;
  function esc(s){ return s.replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function date(d){ return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function card(e, i){
    return '<a class="zep" href="' + e.url + '" target="_blank" rel="noopener"><span class="zep__img"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="' + e.img + '" alt="' + esc(e.t) + '">' +
      (e.latest ? '<em>Latest episode</em>' : '') + '<i class="bi bi-play-fill"></i></span><h3>' + esc(e.t.replace(/^\d+\s*~\s*/, '')) + '</h3><span class="zep__m">' + date(e.d) + ' · ' + e.m + ' min</span></a>';
  }
  if (D[0]) D[0].latest = true;
  document.addEventListener('error', function(ev){
    var t = ev.target; if (t && t.tagName === 'IMG' && t.closest && t.closest('.zep__img')) { t.style.display = 'none'; t.parentNode.classList.add('is-ph'); }
  }, true);
  function add(){ var s = list.slice(n, n + STEP); grid.insertAdjacentHTML('beforeend', s.map(card).join('')); n += s.length; more.style.display = n < list.length ? '' : 'none'; }
  function apply(){
    var s = q.value.trim().toLowerCase();
    list = D.filter(function(e){ return !s || e.t.toLowerCase().indexOf(s) > -1; });
    n = 0; grid.innerHTML = ''; add();
    if (!list.length) grid.innerHTML = '<p class="zlead">No episodes match your search.</p>';
  }
  q.addEventListener('input', apply); more.addEventListener('click', add); apply();
})();
