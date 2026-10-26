'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/auth/me').then((d) => setUser(d.user)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const logout = async () => { await api('/auth/logout', { method: 'POST' }).catch(() => {}); setUser(null); };
  return <Ctx.Provider value={{ user, setUser, loading, logout }}>{children}</Ctx.Provider>;
}
