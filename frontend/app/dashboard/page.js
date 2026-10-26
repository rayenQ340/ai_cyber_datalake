'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import CountUp from '@/components/CountUp';

const level = (s) => (s >= 80 ? 'hi' : s >= 50 ? 'md' : 'lo');
const time = (d) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [grown, setGrown] = useState(false);

  const load = useCallback(() => {
    api('/dashboard').then(setData).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    load();
    const t = setInterval(load, 8000); // live refresh
    return () => clearInterval(t);
  }, [user, loading, router, load]);

  useEffect(() => { if (data) { const t = setTimeout(() => setGrown(true), 80); return () => clearTimeout(t); } }, [data]);

  if (!user) return <p className="wrap band">Loading…</p>;
  if (error) return <p className="wrap band err">{error} Check that the API is running and the database is seeded.</p>;
  if (!data) return <p className="wrap band">Loading your SOC overview…</p>;

  const { kpis, hosts, distribution, incidents } = data;
  const cards = [
    ['Alerts analyzed', kpis.alertsAnalyzed],
    ['Open incidents', kpis.openIncidents],
    ['Hosts at high risk', kpis.highRiskHosts],
    ['Anomalies flagged', kpis.anomalies],
  ];

  return (
    <main className="d">
      <div className="top">
        <div><h2>Welcome, {user.name.split(' ')[0]}. Here is your SOC overview.</h2><span className="why live">Live, refreshes every 8 seconds · {user.role}</span></div>
        <button className="btn alt" onClick={load}>Refresh now</button>
      </div>
      <div className="kpis">{cards.map(([l, v]) => <div className="card kpi" key={l}><b><CountUp to={Number(v)} /></b><span>{l}</span></div>)}</div>
      <div className="two">
        <div className="card"><h3>Hosts to handle first</h3>
          <div className="scroll"><table><thead><tr><th>Host</th><th>Risk</th><th>Main factors</th><th>Status</th></tr></thead>
            <tbody>{hosts.map((h) => (
              <tr key={h._id}><td>{h.ip}</td><td><span className={`score ${level(h.risk)}`}>{h.risk}</span></td><td className="why">{h.factors}</td><td>{h.status}</td></tr>
            ))}</tbody></table></div>
        </div>
        <div className="card"><h3>Attack distribution</h3>
          {distribution.map((d) => (
            <div className="bar" key={d.label}><div><span>{d.label}</span><b>{d.percent}%</b></div><i style={{ width: grown ? `${Math.min(d.percent * 2.4, 100)}%` : '0%' }} /></div>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}><h3>Latest incidents</h3>
        <div className="scroll"><table><thead><tr><th>Time</th><th>Source</th><th>Destination</th><th>Port</th><th>Detected by</th></tr></thead>
          <tbody>{incidents.map((i) => (
            <tr key={i._id}><td>{time(i.createdAt)}</td><td>{i.src}</td><td>{i.dst}</td><td>{i.port}</td><td>{i.detectedBy}</td></tr>
          ))}</tbody></table></div>
      </div>
    </main>
  );
}
