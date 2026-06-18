import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Something went wrong.');
    }
  }

  return (
    <>
      <Head>
        <title>Admin login</title>
      </Head>
      <div className="admin-shell">
        <div className="admin-card" style={{ maxWidth: 360, margin: '60px auto 0' }}>
          <h3 className="display">Sign in</h3>
          <form onSubmit={submit}>
            <div className="field">
              <label>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error ? (
              <p style={{ color: 'var(--stamp-red)', fontSize: 13, marginBottom: 12 }}>{error}</p>
            ) : null}
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
