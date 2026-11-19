/* Events: photo lightbox with keyboard + swipe */
(function(){
  var tiles = [].slice.call(document.querySelectorAll('.zev__t')), lb = document.getElementById('zlb');
  if (!tiles.length || !lb) return;
  var img = lb.querySelector('img'), i = 0, x0 = null;
  function show(n){ i = (n + tiles.length) % tiles.length; img.src = tiles[i].getAttribute('data-full'); img.alt = tiles[i].querySelector('img').alt; }
  function open(n){ show(n); lb.hidden = false; document.documentElement.style.overflow = 'hidden'; }
  function close(){ lb.hidden = true; img.removeAttribute('src'); document.documentElement.style.overflow = ''; }
  tiles.forEach(function(t, n){ t.addEventListener('click', function(){ open(n); }); });
  lb.querySelector('.zlb__x').addEventListener('click', close);
  lb.querySelector('.zlb__n--p').addEventListener('click', function(e){ e.stopPropagation(); show(i - 1); });
  lb.querySelector('.zlb__n--n').addEventListener('click', function(e){ e.stopPropagation(); show(i + 1); });
  lb.addEventListener('click', function(e){ if (e.target === lb) close(); });
  document.addEventListener('keydown', function(e){
    if (lb.hidden) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1);
  });
  lb.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function(e){ if (x0 === null) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) show(i + (d < 0 ? 1 : -1)); x0 = null; });
})();
