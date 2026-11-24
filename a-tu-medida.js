// Carrusel "Hecho a tu medida": la tarjeta de atrás pasa al frente
(function () {
  const imgs = [
    ['img/mt-tapa.jpg', 'Tapa personalizada de cuadernillo'],
    ['img/mt-trofeo.jpg', 'Reconocimiento personalizado'],
    ['img/mt-caja.jpg', 'Caja personalizada'],
    ['img/mt-dentista.jpg', 'Placa de escritorio personalizada']
  ];
  const main = document.querySelector('.mt-main img');
  const peek = document.querySelector('.mt-peek img');
  const btn = document.getElementById('next');
  if (!main || !peek || !btn) return;
  let i = 0, timer;
  function show(n) {
    i = (n + imgs.length) % imgs.length;
    main.src = imgs[i][0]; main.alt = imgs[i][1];
    peek.src = imgs[(i + 1) % imgs.length][0];
  }
  function auto() { clearInterval(timer); timer = setInterval(() => show(i + 1), 5000); }
  btn.addEventListener('click', () => { show(i + 1); auto(); });
  show(0); auto();
})();
