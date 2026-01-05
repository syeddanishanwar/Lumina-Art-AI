
import React, { useEffect, useRef } from 'react';
import { ArtConfig, Particle } from '../types';

interface ArtCanvasProps {
  config: ArtConfig;
}

const ArtCanvas: React.FC<ArtCanvasProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  // Fix: Added initial value 'undefined' to satisfy useRef's expectation of 1 argument
  const requestRef = useRef<number | undefined>(undefined);
  const mouse = useRef({ x: -1000, y: -1000 });

  const initParticles = (width: number, height: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: Math.random() * (config.particleSize[1] - config.particleSize[0]) + config.particleSize[0],
        color: config.colors[Math.floor(Math.random() * config.colors.length)]
      });
    }
    particles.current = newParticles;
  };

  const animate = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = config.background;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    particles.current.forEach((p, i) => {
      // Vortex
      if (config.vortexStrength !== 0) {
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        p.vx += (dx / dist) * config.vortexStrength;
        p.vy += (dy / dist) * config.vortexStrength;
      }

      // Physics
      p.vy += config.gravity;
      p.vx *= config.friction;
      p.vy *= config.friction;
      p.x += p.vx;
      p.y += p.vy;

      // Mouse interaction
      const mdx = mouse.current.x - p.x;
      const mdy = mouse.current.y - p.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 150) {
        const force = (150 - mdist) / 150;
        p.vx -= mdx * force * 0.05;
        p.vy -= mdy * force * 0.05;
      }

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Connections
      if (config.connectionRadius > 0) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p2 = particles.current[j];
          const dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          if (dist < config.connectionRadius) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 1 - dist / config.connectionRadius;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Render Particle
      ctx.globalAlpha = 1;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (config.shapeType === 'circle') {
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      } else if (config.shapeType === 'square') {
        ctx.rect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      } else {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
      }
      ctx.fill();
    });

    requestRef.current = requestAnimationFrame(() => animate(ctx, width, height));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    requestRef.current = requestAnimationFrame(() => animate(ctx, canvas.width, canvas.height));

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return <canvas ref={canvasRef} className="fixed inset-0" />;
};

export default ArtCanvas;
