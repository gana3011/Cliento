'use client';

import { Space, Table, TableProps, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import type { Buyer } from "@prisma/client";

interface BuyerTableProps {
  data: Buyer[];
  total: number;
  page: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
}

interface BuyerRow {
  key: string;
  fullName: string;
  phone: string;
  city: string;
  propertyType: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline: string;
  status: string;
  updatedAt: string;
}

const timelineMap: Record<string, string> = {
  ZERO_3M: '0-3m',
  THREE_6M: '3-6m',
  GT_6M: '>6m',
  OTHER: 'other',
};

const columns: TableProps<BuyerRow>['columns'] = [
  { title: 'Name', dataIndex: 'fullName', key: 'fullName' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'City', dataIndex: 'city', key: 'city' },
  { title: 'PropertyType', dataIndex: 'propertyType', key: 'propertyType' },
  { title: 'Budget Min', dataIndex: 'budgetMin', key: 'budgetMin' },
  { title: 'Budget Max', dataIndex: 'budgetMax', key: 'budgetMax' },
  { title: 'Timeline', dataIndex: 'timeline', key: 'timeline' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'UpdatedAt', dataIndex: 'updatedAt', key: 'updatedAt' },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>View</a>
        <a>Edit</a>
      </Space>
    ),
  },
];

export default function BuyerTable({ data, total, page, pageSize, searchParams }: BuyerTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.q || '');

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams({ ...searchParams, q: search, page: "1" });
      router.push(`/buyers?${params.toString()}`);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const buyerData = data.map((b) => ({
    key: b.id,
    fullName: b.fullName,
    phone: b.phone,
    city: b.city,
    propertyType: b.propertyType,
    budgetMin: b.budgetMin,
    budgetMax: b.budgetMax,
    timeline: timelineMap[b.timeline],
    status: b.status,
    updatedAt: dayjs(b.updatedAt).format("DD MMM YYYY, hh:mm A"),
  }));

  return (
    <div>
      <Input.Search
        placeholder="Search name, phone, email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table<BuyerRow>
        columns={columns}
        dataSource={buyerData}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p) => {
            const params = new URLSearchParams({ ...searchParams, page: String(p) });
            router.push(`/buyers?${params.toString()}`);
          },
        }}
      />
    </div>
  );
}
