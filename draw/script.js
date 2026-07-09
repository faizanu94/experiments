const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = context.createLinearGradient(
  0,
  0,
  canvas.width,
  canvas.height,
);
gradient.addColorStop(0, "white");
gradient.addColorStop(0.5, "gold");
gradient.addColorStop(1, "green");

let hue = 1;

context.fillStyle = gradient;
context.strokeStyle = "white";
context.lineWidth = 5;

const mouse = {
  x: 0,
  y: 0,
  pressed: false,
  radius: 100,
};

class Particle {
  constructor() {
    this.radius = Math.floor(Math.random() * 40 + 4);
    this.x = this.radius + Math.random() * (canvas.width - this.radius);
    this.y = this.radius + Math.random() * (canvas.height - this.radius);
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
    this.pushX = 0;
    this.pushY = 0;
    this.friction = 0.95;
  }

  draw() {
    // context.fillStyle = `hsl(${hue} , 100%, 50%)`;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  update() {
    if (mouse.pressed) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.hypot(dx, dy) || 0.0001;
      const force = mouse.radius / distance;

      if (distance < mouse.radius + this.radius) {
        const angle = Math.atan2(dy, dx);
        this.pushX += Math.cos(angle) * force;
        this.pushY += Math.sin(angle) * force;
      }
    }

    this.x += (this.pushX *= this.friction) + this.vx;
    this.y += (this.pushY *= this.friction) + this.vy;

    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx *= -1;
    } else if (this.x > canvas.width - this.radius) {
      this.x = canvas.width - this.radius;
      this.vx *= -1;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy *= -1;
    } else if (this.y > canvas.height - this.radius) {
      this.y = canvas.height - this.radius;
      this.vy *= -1;
    }
  }

  reset() {
    this.x = this.radius + Math.random() * (canvas.width - this.radius * 2);
    this.y = this.radius + Math.random() * (canvas.height - this.radius * 2);
  }
}

class Effect {
  constructor() {
    this.particles = [];
    this.numberOfParticles = 400;
    this.maxDistanceBetweenParticles = 120;
    this.createParticles();

    window.addEventListener("resize", (e) => {
      this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
    });

    window.addEventListener("mousemove", (e) => {
      if (mouse.pressed) {
        mouse.x = e.x;
        mouse.y = e.y;
      }
    });

    window.addEventListener("mousedown", (e) => {
      mouse.pressed = true;
      mouse.x = e.x;
      mouse.y = e.y;
      for (let i = 0; i < 1; i++) {
        // this.particles.push(new Particle(e.x, e.y));
      }
    });

    window.addEventListener("mouseup", (e) => {
      mouse.pressed = false;
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && mouse.radius < 400) {
        mouse.radius += 2;
      }
      if (e.key === "ArrowDown" && mouse.radius > 25) {
        mouse.radius -= 2;
      }
    });
  }

  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }

  handleParticles() {
    // context.strokeStyle = `hsl(${hue} , 100%, 50%)`;
    this.connectParticles(context);
    this.particles.forEach((particle) => {
      particle.draw(context);
      particle.update();
    });

    if (mouse.pressed) {
      context.save();
      context.globalAlpha = 0.09;
      context.fillStyle = `hsl(${hue} , 100%, 50%)`;
      //   context.fillStyle = "black";
      context.beginPath();
      context.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.restore();
    }
  }

  connectParticles() {
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x;
        const dy = this.particles[a].y - this.particles[b].y;
        const distance = Math.hypot(dx, dy);
        if (distance < this.maxDistanceBetweenParticles) {
          context.save();
          const opacity = 1 - distance / this.maxDistanceBetweenParticles;
          context.globalAlpha = opacity;
          context.beginPath();
          context.moveTo(this.particles[a].x, this.particles[a].y);
          context.lineTo(this.particles[b].x, this.particles[b].y);
          context.stroke();
          context.restore();
        }
      }
    }
  }

  resize(width, height) {
    canvas.width = width;
    canvas.height = height;
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.5, "gold");
    gradient.addColorStop(1, "orangered");
    context.fillStyle = gradient;
    context.strokeStyle = "white";
    this.particles.forEach((particle) => {
      particle.reset();
    });
  }
}

const effect = new Effect();

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  effect.handleParticles();
  hue += 0.1;
  requestAnimationFrame(animate);
}

animate();
