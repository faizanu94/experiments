const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let hue = 0;

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius = Math.random() * 40 + 5;
    this.x = this.radius + Math.random() * (effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (effect.height - this.radius * 2);
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
    this.speedX = 0;
    this.speedY = 0;
    this.friction = 0.95;
  }

  draw(context) {
    context.strokeStyle = "black";
    context.fillStyle = `hsl(${this.x * 0.5}, 100%, 50%)`;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  update() {
    if (this.effect.mouse.pressed) {
      const dx = this.x - this.effect.mouse.x;
      const dy = this.y - this.effect.mouse.y;
      const distance = Math.hypot(dx, dy);
      const force = this.effect.mouse.radius / distance;

      if (distance < this.effect.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        this.speedX += Math.cos(angle) * force;
        this.speedY += Math.sin(angle) * force;
      }
    }

    this.x += this.vx + (this.speedX *= this.friction);
    this.y += this.vy + (this.speedY *= this.friction);

    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx *= 1;
    } else if (this.x > this.effect.width - this.radius) {
      this.x = this.effect.width - this.radius;
      this.vx *= -1;
    }

    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy *= 1;
    } else if (this.y > this.effect.height - this.radius) {
      this.y = this.effect.height - this.radius;
      this.vy *= -1;
    }
  }
}

class Effect {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.particles = [];
    this.numberOfParticles = 400;
    this.maxDistance = 100;
    this.mouse = {x: 0, y: 0, radius: 100, pressed: false};
    this.createParticles();

    window.addEventListener("mousemove", (e) => {
      if (this.mouse.pressed) {
        this.mouse.x = e.x;
        this.mouse.y = e.y;
      }
    });

    window.addEventListener("mousedown", (e) => {
      this.mouse.pressed = true;
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener("mouseup", (e) => {
      this.mouse.pressed = false;
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });
  }

  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }

  handleParticles(context) {
    this.connectParticles(context);
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles[i].draw(context);
      this.particles[i].update();
    }
  }

  connectParticles(context) {
    context.strokeStyle = "white";
    context.lineWidth = "2";
    for (let i = 0; i < this.numberOfParticles; i++) {
      for (let j = 0; j < this.numberOfParticles; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.hypot(dx, dy);
        if (distance < this.maxDistance) {
          context.save();
          const opacity = 1 - distance / this.maxDistance;
          context.globalAlpha = opacity;
          context.beginPath();
          context.moveTo(this.particles[i].x, this.particles[i].y);
          context.lineTo(this.particles[j].x, this.particles[j].y);
          context.stroke();
          context.restore();
        }
      }
    }
  }
}

const effect = new Effect(canvas);

const animate = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles(context);
  hue++;
  requestAnimationFrame(animate);
};

animate();
