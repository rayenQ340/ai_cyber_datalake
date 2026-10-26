'use client';
import { useEffect, useState } from 'react';

const EVENTS = [
  ['Exploit signature', '192.168.1.14', '203.0.113.8:445', 'hot', 'Classifier'],
  ['Traffic spike', '10.0.0.52', '198.51.100.23:53', 'warn', 'Anomaly'],
  ['Policy violation', '172.16.4.9', '203.0.113.77:8080', 'warn', 'Classifier'],
  ['Information leak attempt', '192.168.1.77', '192.0.2.40:22', 'warn', 'Classifier'],
  ['Rare port, no rule match', '10.0.2.31', '198.51.100.5:4444', 'hot', 'Anomaly'],
  ['Protocol command decode', '10.0.0.52', '203.0.113.19:80', 'low', 'Classifier'],
];

export default function LiveFeed() {
  const [items, setItems] = useState(EVENTS.slice(0, 4).map((e, i) => ({ id: i, e })));
  useEffect(() => {
    let n = 4;
    const t = setInterval(() => {
      setItems((cur) => [{ id: n, e: EVENTS[n % EVENTS.length] }, ...cur].slice(0, 5));
      n++;
    }, 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <ul className="feed" aria-label="Example live threat feed">
      {items.map(({ id, e }) => (
        <li key={id} className={e[3]}>
          <i />
          <div><b>{e[0]}</b><span>{e[1]} to {e[2]}</span></div>
          <em>{e[4]}</em>
        </li>
      ))}
    </ul>
  );
}
