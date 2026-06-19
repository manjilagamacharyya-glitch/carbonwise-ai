/* ==========================================================================
   CARBONWISE AI - INTERACTIVE NODE-GARDEN PARTICLE ENGINE
   ========================================================================== */

export function initBackgroundParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const properties = {
    bgColor: 'rgba(9, 9, 11, 1)',
    particleColor: 'rgba(6, 182, 212, 0.4)', // Default cyan particle tint
    lineColor: 'rgba(6, 182, 212, 0.08)',
    particleRadius: 2.5,
    particleCount: 75,
    maxVelocity: 0.5,
    lineLength: 150,
  };

  // Mouse Interaction coordinates
  const mouse = {
    x: null,
    y: null,
    radius: 180,
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.velocityX = Math.random() * (properties.maxVelocity * 2) - properties.maxVelocity;
      this.velocityY = Math.random() * (properties.maxVelocity * 2) - properties.maxVelocity;
      this.radius = Math.random() * properties.particleRadius + 0.5;
      this.glowColor = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.5)' : 'rgba(16, 185, 129, 0.5)';
    }

    position() {
      // Bounce off walls
      if (this.x + this.velocityX > width || this.x + this.velocityX < 0) {
        this.velocityX = -this.velocityX;
      }
      if (this.y + this.velocityY > height || this.y + this.velocityY < 0) {
        this.velocityY = -this.velocityY;
      }

      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.glowColor;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.glowColor;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  function drawLines() {
    let x1, y1, x2, y2, distance, opacity;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        x1 = particles[i].x;
        y1 = particles[i].y;
        x2 = particles[j].x;
        y2 = particles[j].y;
        distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

        if (distance < properties.lineLength) {
          opacity = 1 - distance / properties.lineLength;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connect with mouse node
      if (mouse.x !== null) {
        x1 = particles[i].x;
        y1 = particles[i].y;
        distance = Math.sqrt((mouse.x - x1) * (mouse.x - x1) + (mouse.y - y1) * (mouse.y - y1));
        if (distance < mouse.radius) {
          opacity = 1 - distance / mouse.radius;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.12})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Apply radial gradient background
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height));
    gradient.addColorStop(0, '#040b18');
    gradient.addColorStop(0.5, '#09090b');
    gradient.addColorStop(1, '#020203');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].position();
      particles[i].draw();
    }
    drawLines();
    requestAnimationFrame(loop);
  }

  // Populate particles
  for (let i = 0; i < properties.particleCount; i++) {
    particles.push(new Particle());
  }

  // Start Animation
  loop();
}
