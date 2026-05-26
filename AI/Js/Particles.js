// Interactive Background Canvas Particles for Quizzora_v2
// Simulates floating neural sparks and data dots when Phase 7 is unlocked

class ParticleEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.maxParticles = 80;
    this.enabled = false;
    this.animationFrameId = null;
    this.mouse = { x: null, y: null, radius: 120 };
  }

  /**
   * Initializes canvas and event listeners
   * @param {HTMLCanvasElement} canvas 
   */
  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resizeCanvas();

    window.addEventListener("resize", () => this.resizeCanvas());
    window.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    window.addEventListener("mouseout", () => this.handleMouseOut());
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleMouseOut() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  /**
   * Sets particle activation state dynamically
   * @param {boolean} enabled 
   */
  setEnabled(enabled) {
    if (enabled === this.enabled) return;
    this.enabled = enabled;
    if (enabled) {
      this.spawnParticles();
      this.animate();
    } else {
      this.particles = [];
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  spawnParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? "#00f0ff" : "#bd00ff", // Neon turquoise or purple
      pulseSpeed: Math.random() * 0.02 + 0.005
    };
  }

  animate() {
    if (!this.enabled || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Particle update and rendering
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Pulse alpha
      p.alpha += p.pulseSpeed;
      if (p.alpha > 0.8 || p.alpha < 0.2) {
        p.pulseSpeed = -p.pulseSpeed;
      }

      // Bounce borders
      if (p.x < 0 || p.x > this.canvas.width) p.vx = -p.vx;
      if (p.y < 0 || p.y > this.canvas.height) p.vy = -p.vy;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
    }

    // Draw neural connections
    this.ctx.globalAlpha = 0.15;
    this.ctx.shadowBlur = 0;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const grad = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grad.addColorStop(0, p1.color);
          grad.addColorStop(1, p2.color);

          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = grad;
          this.ctx.lineWidth = (1 - dist / 110) * 0.8;
          this.ctx.stroke();
        }
      }
    }

    // Draw mouse neural pulls
    if (this.mouse.x !== null) {
      this.ctx.globalAlpha = 0.3;
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = "#00f0ff";
          this.ctx.lineWidth = (1 - dist / this.mouse.radius) * 1.2;
          this.ctx.stroke();
        }
      }
    }

    this.ctx.globalAlpha = 1.0; // Reset
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

export const Particles = new ParticleEngine();
export default Particles;
