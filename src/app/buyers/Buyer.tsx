'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Input, Select, Row, Col, Space, Button } from 'antd';
import BuyerTable from '../components/BuyerTable';
import BuyerActions from '../components/BuyerActions';
import type { Buyer as BuyerType } from "@prisma/client";
import Link from 'next/link';
import NavBar from '../components/NavBar';

interface BuyerProps {
  data: BuyerType[];
  total: number;
  currentPage: number;
  pageSize: number;
  filters: {
    page?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    search?: string;
  };
  filterOptions: {
    cities: string[];
    propertyTypes: string[];
    statuses: string[];
    timelines: string[];
  };
}

export default function Buyer({ 
  data, 
  total, 
  currentPage, 
  pageSize, 
  filters,
  filterOptions 
}: BuyerProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div>
    <div style={{ padding: '2rem 1rem 2rem 1rem', paddingBottom: '2rem' }}>
      {/* Filters */}
      
      <BuyerActions 
        filters={filters}
        filterOptions={filterOptions}
      />

      <BuyerTable
        data={data} 
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
    </div>
  );
}