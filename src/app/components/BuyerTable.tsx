'use client';
import { Space, Table, TableProps } from 'antd';
import React from 'react';
import type { Buyer as BuyerType } from "@prisma/client";
import dayjs from 'dayjs';
import type { Buyer } from "@prisma/client";
import Link from 'next/link';

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
    render: (text) => <span style={{ fontWeight: '500', color: '#2c3e50' }}>{text}</span>
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
    render: (status) => {
      return (
        <span 
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '700',
            backgroundColor: status === 'Dropped' ? '#f0f0f0' : 'rgba(217, 119, 6, 0.1)',
            color: status === 'Dropped' ? '#666' : '#D97706',
            border: status === 'Dropped' ? '1px solid #ccc' : '1px solid rgba(217, 119, 6, 0.3)',
            textTransform: 'uppercase'
          }}
        >
          {status}
        </span>
      );
    }
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
        <Link 
          href={`/buyers/${record.key}`}
          style={{ 
            color: '#D97706', 
            fontWeight: '700',
            textDecoration: 'none',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            border: '1px solid rgba(217, 119, 6, 0.3)'
          }}
        >
          View/Edit
        </Link>
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
        size="middle"
        style={{
          backgroundColor: '#FFFDF6'
        }}
        rowClassName={(record, index) => 
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
      />
      <style jsx global>{`
        .table-row-light td {
          background-color: #FFFDF6 !important;
        }
        .table-row-dark td {
          background-color: #ffffff !important;
        }
        .ant-table-thead > tr > th {
          background-color: #A9BD93 !important;
          color: white !important;
          font-weight: 600 !important;
          border-bottom: 2px solid #8fa876 !important;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: rgba(169, 189, 147, 0.1) !important;
        }
        .ant-pagination-item-active {
          border-color: #A9BD93 !important;
          background-color: #A9BD93 !important;
        }
        .ant-pagination-item-active a {
          color: white !important;
        }
        .ant-pagination-item:hover {
          border-color: #A9BD93 !important;
        }
        .ant-pagination-item:hover a {
          color: #A9BD93 !important;
        }
        .ant-pagination-next:hover .ant-pagination-item-link,
        .ant-pagination-prev:hover .ant-pagination-item-link {
          border-color: #A9BD93 !important;
          color: #A9BD93 !important;
        }
      `}</style>
    </div>
  );
};

export default BuyerTable;