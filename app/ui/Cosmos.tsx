'use client';
import { useEffect, useRef } from 'react';
export default function Cosmos({
  mode,
  motion,
  burst = 0,
}: {
  mode: string;
  motion: boolean;
  burst?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const current = useRef({ mode, motion, burst });
  current.current = { mode, motion, burst };
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    let w = 0,
      h = 0,
      frame = 0,
      last = 0,
      time = 0,
      phase = 1;
    const pointer = { x: 0, y: 0 };
    let seed = 811;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const stars = Array.from({ length: 220 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.35 + rand() * 1.1,
      p: rand() * 6.28,
      s: rand(),
    }));
    type Branch = {
      x: number;
      y: number;
      xx: number;
      yy: number;
      depth: number;
      r: number;
    };
    const branches: Branch[] = [];
    function grow(x: number, y: number, a: number, len: number, depth: number) {
      const xx = x + Math.cos(a) * len,
        yy = y + Math.sin(a) * len;
      branches.push({ x, y, xx, yy, depth, r: rand() });
      if (depth < 6) {
        const n = depth < 2 ? 3 : 2;
        for (let i = 0; i < n; i++)
          grow(
            xx,
            yy,
            a + (i - (n - 1) / 2) * (0.45 + rand() * 0.38),
            len * (0.64 + rand() * 0.13),
            depth + 1,
          );
      }
    }
    grow(0.5, 0.94, -Math.PI / 2, 0.18, 0);
    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 1.8);
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const move = (e: PointerEvent) => {
      if (!current.current.motion) return;
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 12;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 8;
    };
    window.addEventListener('pointermove', move);
    function draw(now: number) {
      if (!ctx) return;
      frame = requestAnimationFrame(draw);
      if (document.hidden || now - last < 30) return;
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (current.current.motion) time += dt;
      const target =
        current.current.mode === 'landing'
          ? 1
          : current.current.mode === 'overview'
            ? 0.75
            : 0;
      phase = current.current.motion ? phase + (target - phase) * 0.06 : target;
      ctx.clearRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(
        w * 0.5,
        h * 0.7,
        0,
        w * 0.5,
        h * 0.7,
        w * 0.55,
      );
      glow.addColorStop(0, 'rgba(108,66,25,.13)');
      glow.addColorStop(0.5, 'rgba(51,38,27,.05)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      stars.forEach((s) => {
        const x = s.x * w + pointer.x * s.s,
          y = s.y * h + pointer.y * s.s;
        ctx.fillStyle = `rgba(242,221,184,${0.15 + (0.5 + 0.5 * Math.sin(time * 0.7 + s.p)) * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (phase > 0.01) {
        ctx.save();
        const sx = w < 650 ? 1.8 : 1.38;
        const px = (x: number) => (x - 0.5) * w * sx + w * 0.5 + pointer.x;
        const py = (y: number) => y * h * 0.94 + h * 0.05 + pointer.y;
        branches.forEach((b) => {
          ctx.globalAlpha = phase;
          ctx.strokeStyle = `rgba(229,177,91,${b.depth < 3 ? 0.48 : 0.12 + b.r * 0.22})`;
          ctx.lineWidth = b.depth < 2 ? 1.2 : 0.65;
          ctx.beginPath();
          ctx.moveTo(px(b.x), py(b.y));
          ctx.bezierCurveTo(
            px(b.x),
            py(b.y - (b.y - b.yy) * 0.5),
            px(b.xx),
            py(b.yy + (b.y - b.yy) * 0.35),
            px(b.xx),
            py(b.yy),
          );
          ctx.stroke();
          const t = (time * 0.08 + b.r) % 1;
          ctx.fillStyle = `rgba(255,214,136,${0.3 + b.r * 0.5})`;
          ctx.beginPath();
          ctx.arc(
            px(b.x) + (px(b.xx) - px(b.x)) * t,
            py(b.y) + (py(b.yy) - py(b.y)) * t,
            0.8,
            0,
            6.28,
          );
          ctx.fill();
          if (b.depth < 5) {
            ctx.shadowBlur = b.depth < 2 ? 18 : 8;
            ctx.shadowColor = '#fbbf66';
            ctx.fillStyle = `rgba(255,220,151,${0.45 + Math.sin(time + b.r * 8) * 0.15})`;
            ctx.beginPath();
            ctx.arc(px(b.xx), py(b.yy), b.depth < 2 ? 3 : 1.6, 0, 6.28);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
        ctx.restore();
      }
      const x = w * 0.5,
        y = h * 0.8;
      const halo = ctx.createRadialGradient(x, y, 0, x, y, 80);
      halo.addColorStop(0, 'rgba(255,207,120,.15)');
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.fillRect(x - 80, y - 80, 160, 160);
      if (current.current.burst && current.current.motion) {
        const elapsed = (now - current.current.burst) / 1000;
        if (elapsed < 1.5) {
          for (let i = 0; i < 60; i++) {
            const a = i * 2.4,
              rr = elapsed * (70 + i * 2);
            ctx.fillStyle = `rgba(255,205,117,${Math.max(0, 1 - elapsed / 1.5)})`;
            ctx.fillRect(
              x + Math.cos(a) * rr,
              y - h * 0.3 + Math.sin(a) * rr,
              2,
              2,
            );
          }
        }
      }
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', move);
    };
  }, []);
  return <canvas ref={canvas} className="cosmos" aria-hidden="true" />;
}
