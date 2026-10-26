'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function Login() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (user) router.replace('/dashboard'); }, [user, router]);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try { const d = await api('/auth/login', { method: 'POST', body: form }); setUser(d.user); router.push('/dashboard'); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <form className="auth" onSubmit={submit}>
      <h2>Log in</h2><p className="why">Access your SOC dashboard.</p>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <label htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <div className="err" role="alert">{error}</div>
      <button className="btn" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      <p className="why center">No account yet? <Link href="/signup">Sign up</Link></p>
    </form>
  );
}
