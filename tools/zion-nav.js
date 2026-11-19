
/* More dropdown: click/tap, Escape and outside click (hover and focus handled in CSS) */
(function(){
  var more = document.querySelector('.nav__more'); if (!more) return;
  var btn = more.querySelector('button');
  function set(o){ more.classList.toggle('is-open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
  btn.addEventListener('click', function(e){ e.stopPropagation(); set(!more.classList.contains('is-open')); });
  document.addEventListener('click', function(e){ if (!more.contains(e.target)) set(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { set(false); btn.blur(); } });
})();
