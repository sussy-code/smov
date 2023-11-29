import { useEffect, useRef } from "react";
import "./Lightbar.css";

class Particle {
  x = 0;

  y = 0;

  radius = 0;

  direction = 0;

  speed = 0;

  lifetime = 0;

  ran = 0;

  image: null | HTMLImageElement = null;

  constructor(canvas: HTMLCanvasElement, { doFish } = { doFish: false }) {
    if (doFish) {
      this.image = new Image();
      if (this.image) this.image.src = "/fishie.png";
    }

    this.reset(canvas);
    this.initialize(canvas);
  }

  reset(canvas: HTMLCanvasElement) {
    this.x = Math.round((Math.random() * canvas.width) / 2 + canvas.width / 4);
    this.y = Math.random() * 100 + 5;

    this.radius = 1 + Math.floor(Math.random() * 0.5);
    this.direction = (Math.random() * Math.PI) / 2 + Math.PI / 4;
    this.speed = 0.02 + Math.random() * 0.08;

    const second = 60;
    this.lifetime = second * 3 + Math.random() * (second * 30);

    if (this.image) {
      this.direction = Math.random() <= 0.5 ? 0 : Math.PI;
      this.lifetime = 30 * second;
    }

    this.ran = 0;
  }

  initialize(canvas: HTMLCanvasElement) {
    this.ran = Math.random() * this.lifetime;
    const baseSpeed = this.speed;
    this.speed = Math.random() * this.lifetime * baseSpeed;
    this.update(canvas);
    this.speed = baseSpeed;
  }

  update(canvas: HTMLCanvasElement) {
    this.ran += 1;

    const addX = this.speed * Math.cos(this.direction);
    const addY = this.speed * Math.sin(this.direction);
    this.x += addX;
    this.y += addY;

    if (this.ran > this.lifetime) {
      this.reset(canvas);
    }
  }

  render(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();

    const x = this.ran / this.lifetime;
    const o = (x - x * x) * 4;
    ctx.globalAlpha = Math.max(0, o * 0.8);

    if (this.image) {
      ctx.translate(this.x, this.y);
      const w = 10;
      const h = (this.image.naturalWidth / this.image.naturalHeight) * w;
      ctx.rotate(this.direction - Math.PI);
      ctx.drawImage(this.image, -w / 2, h, h, w);
    } else {
      ctx.ellipse(
        this.x,
        this.y,
        this.radius,
        this.radius * 1.5,
        this.direction,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "white";
      ctx.fill();
    }
    ctx.restore();
  }
}

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const particles: Particle[] = [];

    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;

    const shouldShowFishie = Math.floor(Math.random() * 600) === 1;
    const particleCount = 20;

    for (let i = 0; i < particleCount; i += 1) {
      const particle = new Particle(canvas, {
        doFish: shouldShowFishie && i <= particleCount / 2,
      });
      particles.push(particle);
    }

    let shouldTick = true;
    let handle: ReturnType<typeof requestAnimationFrame> | null = null;
    function particlesLoop() {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (shouldTick) {
        for (const particle of particles) {
          particle.update(canvas);
        }
        shouldTick = false;
      }

      canvas.width = canvas.scrollWidth;
      canvas.height = canvas.scrollHeight;
      for (const particle of particles) {
        particle.render(canvas);
      }

      handle = requestAnimationFrame(particlesLoop);
    }
    const interval = setInterval(() => {
      shouldTick = true;
    }, 1e3 / 120); // tick 120 times a sec

    particlesLoop();

    return () => {
      if (handle) cancelAnimationFrame(handle);
      clearInterval(interval);
    };
  }, []);

  return <canvas className="particles" ref={canvasRef} />;
}

export function Lightbar(props: { className?: string }) {
  return (
    <div className="absolute inset-0 w-full h-screen overflow-hidden -mt-64">
      <div className="max-w-screen w-full h-screen relative pt-64">
        <div className={props.className}>
          <div className="lightbar">
            <ParticlesCanvas />
            <div className="lightbar-visual" />
          </div>
        </div>
      </div>
    </div>
  );
}
