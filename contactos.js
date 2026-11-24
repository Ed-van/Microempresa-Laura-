// Formulario de contacto: abre el correo del cliente con el mensaje listo para enviar
(function () {
  const form = document.getElementById('form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    const asunto = encodeURIComponent('Consulta: ' + d.get('tema'));
    const cuerpo = encodeURIComponent((d.get('mensaje') || '') + '\n\nMi correo: ' + (d.get('correo') || ''));
    window.location.href = 'mailto:artecylauracreamosparati@gmail.com?subject=' + asunto + '&body=' + cuerpo;
    document.getElementById('ok').hidden = false;
  });
})();
