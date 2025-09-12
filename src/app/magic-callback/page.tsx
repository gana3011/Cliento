'use client';

import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function MagicCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1)); 
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          router.replace('/login');
        } else {
          router.replace('/buyers');
        }
      });
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <p>Logging you in...</p>;
}
