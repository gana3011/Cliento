'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import { BuyerProps } from '../types/buyer';

export default function Buyer({ data } : BuyerProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchUser();
  }, []);

  useEffect(()=>{
    data
  },[]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {user.email}!</h1>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/buyers');
  const data = await res.json()

  return { props: { data }}
}