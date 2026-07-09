const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

window.addEventListener("resize", function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

let mouse = {x: undefined, y: undefined};
const particles = [];
let hue = 0;

class Particle {
  constructor(x, y) {
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? Math.random() * canvas.height;
    this.size = Math.random() * 50 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }

  draw = () => {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  };

  update = () => {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) {
      this.size -= 0.01;
    }
  };
}

const animateParticles = () => {
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        context.beginPath();
        context.strokeStyle = particles[i].color;
        context.lineWidth = particles[i].size / 10;
        context.moveTo(particles[i].x, particles[i].y);
        context.lineTo(particles[j].x, particles[j].y);
        context.stroke();
        context.closePath();
      }
    }
    if (particles[i].size <= 0.1) {
      particles.splice(i, 1);
      i--;
    }
  }
};

const animate = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(0,0,0,0.01)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  animateParticles();
  hue += 0.5;
  requestAnimationFrame(animate);
};

document.addEventListener("click", function (event) {
  const {x, y} = event;
  mouse = {x, y};
  for (let i = 0; i < 1; i++) {
    particles.push(new Particle(mouse.x, mouse.y));
  }
});

document.addEventListener("mousemove", function (event) {
  const {x, y} = event;
  mouse = {x, y};
  for (let i = 0; i < 1; i++) {
    particles.push(new Particle(mouse.x, mouse.y));
  }
});

animate();
