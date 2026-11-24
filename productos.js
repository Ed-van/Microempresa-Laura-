// ---------- Productos: búsqueda, favoritos y carrusel de categorías ----------
(function () {
  const cards = Array.from(document.querySelectorAll('.pr-card'));
  const q = document.getElementById('q');
  const count = document.getElementById('count');
  const empty = document.getElementById('empty');

  function filter() {
    const term = (q.value || '').trim().toLowerCase();
    let n = 0;
    cards.forEach(c => {
      const ok = !term || c.dataset.title.includes(term);
      c.hidden = !ok;
      if (ok) n++;
    });
    count.textContent = 'Resultados(' + n + ')';
    empty.hidden = n > 0;
  }
  if (q) q.addEventListener('input', filter);

  // Favoritos (se guardan en el navegador)
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem('laura-favs') || '[]'); } catch (e) {}
  cards.forEach(c => {
    const btn = c.querySelector('.pr-fav');
    const id = c.dataset.title + '|' + c.querySelector('img').getAttribute('src');
    const set = on => { btn.classList.toggle('is-on', on); btn.setAttribute('aria-pressed', on ? 'true' : 'false'); };
    set(favs.includes(id));
    btn.addEventListener('click', () => {
      const on = !btn.classList.contains('is-on');
      set(on);
      favs = favs.filter(f => f !== id);
      if (on) favs.push(id);
      try { localStorage.setItem('laura-favs', JSON.stringify(favs)); } catch (e) {}
    });
  });

  // Flechas de categorías: rotan las miniaturas
  const track = document.querySelector('.pr-cats__track');
  if (track) {
    document.querySelector('.pr-arrow--r').addEventListener('click', () => track.appendChild(track.firstElementChild));
    document.querySelector('.pr-arrow--l').addEventListener('click', () => track.insertBefore(track.lastElementChild, track.firstElementChild));
  }
})();
