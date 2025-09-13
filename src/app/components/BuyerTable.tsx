'use client';
import { Space, Table, TableProps } from 'antd';
import React from 'react';
import type { Buyer as BuyerType } from "@prisma/client";
import dayjs from 'dayjs';
import type { Buyer } from "@prisma/client";

interface BuyerTableProps {
  data: BuyerType[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
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

interface BuyerTableProps {
  data: BuyerType[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const timelineMap: Record<string, string> = {
  ZERO_3M: '0-3m',
  THREE_6M: '3-6m',
  GT_6M: '>6m',
  OTHER: 'other'
};

const columns: TableProps<BuyerRow>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'fullName',
    width: 150,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    width: 120,
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    width: 100,
  },
  {
    title: 'Property Type',
    dataIndex: 'propertyType',
    key: 'propertyType',
    width: 120,
  },
  {
    title: 'Budget Min',
    dataIndex: 'budgetMin',
    key: 'budgetMin',
    width: 100,
    render: (value) => value ? `₹${value.toLocaleString()}` : '-',
  },
  {
    title: 'Budget Max',
    dataIndex: 'budgetMax',
    key: 'budgetMax',
    width: 100,
    render: (value) => value ? `₹${value.toLocaleString()}` : '-',
  },
  {
    title: 'Timeline',
    dataIndex: 'timeline',
    key: 'timeline',
    width: 80,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 140,
  },
  {
    title: 'Action',
    key: 'action',
    width: 100,
    render: (_, record) => (
      <Space size="middle">
        <a>View</a>
        <a>Edit</a>
      </Space>
    ),
  },
];

const BuyerTable: React.FC<BuyerTableProps> = ({ 
  data, 
  total, 
  currentPage, 
  pageSize, 
  onPageChange 
}) => {
  const buyerData: BuyerRow[] = data.map(b => ({
    key: b.id,
    fullName: b.fullName,
    phone: b.phone,
    city: b.city,
    propertyType: b.propertyType,
    budgetMin: b.budgetMin,
    budgetMax: b.budgetMax,
    timeline: timelineMap[b.timeline] || b.timeline,
    status: b.status,
    updatedAt: dayjs(b.updatedAt).format("DD MMM YYYY, hh:mm A"),
  }));

  return (
    <div>
      <Table<BuyerRow> 
        columns={columns} 
        dataSource={buyerData}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: onPageChange,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} items`,
          position: ['bottomCenter'],
        }}
        scroll={{ x: 1200 }}
        size="small"
      />
    </div>
  );
};

export default BuyerTable;