'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <header className="site-header">
      <Link className="logo" href="/"><i /> AI Cybersecurity Data Lake</Link>
      <nav>
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={async () => { await logout(); router.push('/'); }}>Log out</button>
          </>
        ) : (
          <>
            <Link href="/">Home</Link>
            <Link href="/login">Log in</Link>
            <Link className="cta" href="/signup">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
