document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('paintCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let currentColor = 'black';

  // Color palette logic
  const colorButtons = document.querySelectorAll('.paint-color-btn');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      currentColor = this.getAttribute('data-color');
      colorButtons.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  if (colorButtons.length) colorButtons[0].classList.add('selected');
  currentColor = colorButtons.length ? colorButtons[0].getAttribute('data-color') : 'black';

  canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.moveTo(x, y);
  });

  canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
  });

  canvas.addEventListener('mousemove', draw);

  function draw(e) {
    if (!drawing) return;
    ctx.strokeStyle = currentColor; // <-- Update here
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  window.clearCanvas = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  }
});