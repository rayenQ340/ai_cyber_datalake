'use client';
import { useEffect, useRef, useState } from 'react';

export default function CountUp({ to, duration = 1400 }) {
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return; }
    let raf, start;
    const a = from.current;
    const step = (t) => {
      start ??= t;
      const p = Math.min((t - start) / duration, 1), e = 1 - Math.pow(1 - p, 4);
      setV(Math.round(a + (to - a) * e));
      if (p < 1) raf = requestAnimationFrame(step); else from.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{v.toLocaleString('en-US')}</>;
}
