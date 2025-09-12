'use client';

import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setMessage(error ? `Error: ${error.message}` : 'Check your email for the magic link!');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login with Magic Link</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Link</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
