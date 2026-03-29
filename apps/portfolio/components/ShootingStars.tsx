"use client";

import { useEffect, useRef } from "react";

/** Lightweight canvas-based shooting stars confined to the hero zone. */
export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let stars: Star[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    interface Star {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      opacity: number;
      life: number;
      maxLife: number;
      width: number;
    }

    function spawnStar(): Star {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      // Start from random position along top or right edge
      const fromTop = Math.random() > 0.3;
      const x = fromTop ? Math.random() * w * 1.2 : w + 20;
      const y = fromTop ? -20 : Math.random() * h * 0.4;
      // Angle: mostly falling left-down (200-250 degrees)
      const angle = (210 + Math.random() * 40) * (Math.PI / 180);
      const maxLife = 40 + Math.random() * 60;

      return {
        x,
        y,
        len: 40 + Math.random() * 80,
        speed: 3 + Math.random() * 5,
        angle,
        opacity: 0.15 + Math.random() * 0.45,
        life: 0,
        maxLife,
        width: 0.5 + Math.random() * 1,
      };
    }

    let spawnTimer = 0;

    function tick() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      // Spawn new stars randomly
      spawnTimer++;
      if (spawnTimer > 12 + Math.random() * 30) {
        spawnTimer = 0;
        if (stars.length < 6) {
          stars.push(spawnStar());
        }
      }

      stars = stars.filter((s) => {
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y -= Math.sin(s.angle) * s.speed;

        // Fade in then fade out
        const progress = s.life / s.maxLife;
        let alpha = s.opacity;
        if (progress < 0.15) alpha *= progress / 0.15;
        else if (progress > 0.6) alpha *= 1 - (progress - 0.6) / 0.4;

        if (alpha <= 0 || s.life >= s.maxLife) return false;

        const tailX = s.x - Math.cos(s.angle) * s.len;
        const tailY = s.y + Math.sin(s.angle) * s.len;

        // Draw gradient trail
        const grad = ctx!.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255, 210, 200, 0)`);
        grad.addColorStop(0.6, `rgba(255, 210, 200, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255, 230, 220, ${alpha})`);

        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(s.x, s.y);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = s.width;
        ctx!.lineCap = "round";
        ctx!.stroke();

        // Bright head dot
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.width * 0.8, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 240, 235, ${alpha})`;
        ctx!.fill();

        return true;
      });

      raf = requestAnimationFrame(tick);
    }

    // Small initial delay
    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 300);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
