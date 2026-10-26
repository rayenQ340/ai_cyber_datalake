'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

const ROLES = ['SOC analyst', 'Security engineer', 'Data scientist', 'Student'];

export default function Signup() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [f, setF] = useState({ name: '', email: '', role: ROLES[0], password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  useEffect(() => { if (user) router.replace('/dashboard'); }, [user, router]);

  async function submit(e) {
    e.preventDefault();
    if (f.password !== f.confirm) return setError('The passwords don’t match.');
    setError(''); setBusy(true);
    try {
      const { confirm, ...body } = f;
      const d = await api('/auth/signup', { method: 'POST', body });
      setUser(d.user); router.push('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <form className="auth" onSubmit={submit}>
      <h2>Create your account</h2><p className="why">Start monitoring hosts in minutes.</p>
      <label htmlFor="name">Full name</label><input id="name" autoComplete="name" required value={f.name} onChange={set('name')} />
      <label htmlFor="email">Work email</label><input id="email" type="email" autoComplete="email" required value={f.email} onChange={set('email')} />
      <label htmlFor="role">Role</label>
      <select id="role" value={f.role} onChange={set('role')}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
      <label htmlFor="password">Password</label><input id="password" type="password" autoComplete="new-password" minLength={8} required value={f.password} onChange={set('password')} />
      <label htmlFor="confirm">Confirm password</label><input id="confirm" type="password" autoComplete="new-password" required value={f.confirm} onChange={set('confirm')} />
      <div className="err" role="alert">{error}</div>
      <button className="btn" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      <p className="why center">Already registered? <Link href="/login">Log in</Link></p>
    </form>
  );
}
