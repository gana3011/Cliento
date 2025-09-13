'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import BuyerTable from '../components/BuyerTable';
import { Buyer as BuyerType } from "@prisma/client";

interface BuyerProps {
  data: BuyerType[];
  total: number;
  page: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
}

export default function Buyer({ data, total, page, pageSize, searchParams }: BuyerProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {user.email}!</h1>
      <BuyerTable
        data={data}
        total={total}
        page={page}
        pageSize={pageSize}
        searchParams={searchParams}
      />
    </div>
  );
}
