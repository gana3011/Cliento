'use client';
import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BuyerTable from '../components/BuyerTable';
import BuyerActions from '../components/BuyerActions';
import { BuyerProps } from '../types/buyer';

export default function Buyer({ 
  data, 
  total, 
  currentPage, 
  pageSize, 
  filters,
  filterOptions 
}: BuyerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

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