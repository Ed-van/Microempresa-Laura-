// Detalle de producto: favoritos y selección de color
(function () {
  document.querySelectorAll('.d-fav').forEach(b => b.addEventListener('click', () => {
    const on = b.classList.toggle('is-on'); b.setAttribute('aria-pressed', on ? 'true' : 'false');
  }));
  const sw = Array.from(document.querySelectorAll('.d-sw button'));
  const main = document.getElementById('dMain');
  const thumbs = Array.from(document.querySelectorAll('.d-thumbs button'));
  let color = 'rosado', view = 0;
  function render() {
    main.classList.add('is-fade');
    setTimeout(() => { main.src = 'img/d-' + color + '-' + view + '.jpg'; main.classList.remove('is-fade'); }, 150);
    thumbs.forEach((t, i) => { t.classList.toggle('is-on', i === view); t.querySelector('img').src = 'img/d-' + color + '-' + i + '.jpg'; });
  }
  sw.forEach(b => b.addEventListener('click', () => {
    sw.forEach(x => x.classList.toggle('is-on', x === b));
    color = b.dataset.color; render();
  }));
  thumbs.forEach((t, i) => t.addEventListener('click', () => { view = i; render(); }));
})();
