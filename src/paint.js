
    window.onload = function () {
      const canvas = document.getElementById('paintCanvas');
      const ctx = canvas.getContext('2d');
  
      let drawing = false;
  
      canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        draw(e); // draw dot if just a click
      });
  
      canvas.addEventListener('mouseup', () => {
        drawing = false;
        ctx.beginPath(); // reset the path so it doesn't connect lines
      });
  
      canvas.addEventListener('mousemove', draw);
  
      function draw(e) {
        if (!drawing) return;
  
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
  
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
  
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
  
      window.clearCanvas = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
      }
    };
 