'use client';
import { useEffect, useRef } from 'react';

// Full-page animated network: drifting nodes, links, packets travelling along them,
// nodes that light up near the cursor. Also drives the cursor spotlight on .card elements.
export default function NetworkCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const D = 150;
    let w, h, nodes = [], packets = [], raf, mouse = { x: -999, y: -999 };

    const init = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(95, Math.floor((w * h) / 15000));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: 1 + Math.random() * 1.6,
      }));
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of nodes) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
          if (d < D * D) {
            ctx.strokeStyle = `rgba(79,124,255,${(1 - Math.sqrt(d) / D) * 0.4})`;
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (!reduce && packets.length < 26 && Math.random() < 0.0004)
              packets.push({ a, b, t: 0, s: 0.006 + Math.random() * 0.01, hot: Math.random() < 0.2 });
          }
        }
      }
      for (const p of nodes) {
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y), near = dm < 170;
        ctx.fillStyle = near ? '#00e5a8' : 'rgba(150,170,255,.75)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + (near ? 1.5 : 0), 0, 7); ctx.fill();
        if (near) {
          ctx.strokeStyle = `rgba(0,229,168,${(1 - dm / 170) * 0.55})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      packets = packets.filter((k) => (k.t += k.s) < 1);
      for (const k of packets) {
        const x = k.a.x + (k.b.x - k.a.x) * k.t, y = k.a.y + (k.b.y - k.a.y) * k.t;
        ctx.fillStyle = k.hot ? '#ff6b6b' : '#00e5a8';
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(x, y, 2.8, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const move = (e) => {
      mouse = { x: e.clientX, y: e.clientY };
      const card = e.target.closest?.('.card, .auth, .lake');
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    };

    init(); frame();
    addEventListener('resize', init);
    addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', init); removeEventListener('pointermove', move); };
  }, []);
  return <canvas ref={ref} className="bg-canvas" aria-hidden="true" />;
}
