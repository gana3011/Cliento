'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Input, Select, Row, Col, Space } from 'antd';
import BuyerTable from '../components/BuyerTable';
import type { Buyer as BuyerType } from "@prisma/client";

const { Search } = Input;
const { Option } = Select;

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
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchUser();
  }, []);

  // Debounced search function
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const updateURL = useCallback((newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change (except when page is explicitly being updated)
    if (!newParams.page) {
      params.delete('page');
    }

    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      updateURL({ search: searchTerm });
    }, 500),
    [updateURL]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    updateURL({ [key]: value });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {user.email}!</h1>
      
      {/* Filters */}
      <div style={{ marginBottom: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Search
              placeholder="Search by name, phone, or email"
              value={searchValue}
              onChange={handleSearchChange}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="City"
              style={{ width: '100%' }}
              value={filters.city}
              onChange={(value) => handleFilterChange('city', value)}
              allowClear
            >
              {filterOptions.cities.map(city => (
                <Option key={city} value={city}>{city}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Property Type"
              style={{ width: '100%' }}
              value={filters.propertyType}
              onChange={(value) => handleFilterChange('propertyType', value)}
              allowClear
            >
              {filterOptions.propertyTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Status"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              allowClear
            >
              {filterOptions.statuses.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Timeline"
              style={{ width: '100%' }}
              value={filters.timeline}
              onChange={(value) => handleFilterChange('timeline', value)}
              allowClear
            >
              {filterOptions.timelines.map(timeline => (
                <Option key={timeline} value={timeline}>
                  {timeline === 'ZERO_3M' ? '0-3m' : 
                   timeline === 'THREE_6M' ? '3-6m' : 
                   timeline === 'GT_6M' ? '>6m' : 
                   timeline}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <BuyerTable
        data={data} 
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}