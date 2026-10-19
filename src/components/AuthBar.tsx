import { useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured, getSessionUser, type SessionUser } from '../lib/supabase';

export default function AuthBar() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void getSessionUser().then(setUser);
    const sb = getSupabase();
    const { data: sub } = sb!.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="authbar muted">
        Supabase offline — set <code>VITE_SUPABASE_URL</code> &amp; <code>VITE_SUPABASE_ANON_KEY</code> in{' '}
        <code>.env.local</code> (see .env.example)
      </div>
    );
  }

  async function signIn() {
    setBusy(true);
    setMsg('');
    const sb = getSupabase()!;
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    setMsg(error ? error.message : 'Signed in');
  }

  async function signUp() {
    setBusy(true);
    setMsg('');
    const sb = getSupabase()!;
    const { error } = await sb.auth.signUp({ email, password });
    setBusy(false);
    setMsg(error ? error.message : 'Check email to confirm (if required), or sign in');
  }

  async function signOut() {
    await getSupabase()!.auth.signOut();
    setMsg('Signed out');
  }

  if (user) {
    return (
      <div className="authbar">
        <span className="muted">DB: {user.email || user.id.slice(0, 8)}</span>
        <button type="button" onClick={() => void signOut()}>
          Sign out
        </button>
        {msg && <span className="tip">{msg}</span>}
      </div>
    );
  }

  return (
    <div className="authbar">
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" disabled={busy} onClick={() => void signIn()}>
        Sign in
      </button>
      <button type="button" disabled={busy} onClick={() => void signUp()}>
        Sign up
      </button>
      {msg && <span className="tip">{msg}</span>}
    </div>
  );
}
