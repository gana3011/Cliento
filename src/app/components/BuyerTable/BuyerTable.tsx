'use client';
import { Space, Table, TableProps } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import styles from './BuyerTable.module.css';
import { BuyerRow, BuyerTableProps } from '@/app/types/buyer';

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
    width: 130,
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
    width: 120,
  },
  {
    title: 'Property Type',
    dataIndex: 'propertyType',
    key: 'propertyType',
    width: 140,
  },
  {
    title: 'Budget',
    key: 'budget',
    width: 140,
    render: (_, record) => {
      const { budgetMin, budgetMax } = record;
      if (budgetMin && budgetMax) {
        return `₹${budgetMin} - ₹${budgetMax}`;
      } else if (budgetMin) {
        return `₹${budgetMin}`;
      } else if (budgetMax) {
        return `Up to ₹${budgetMax}`;
      }
      return 'Not specified';
    },
  },
  {
    title: 'Timeline',
    dataIndex: 'timeline',
    key: 'timeline',
    width: 100,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (status: string) => {
      const isDropped = status === 'Dropped';
      const badgeClass = isDropped ? styles.statusBadgeDropped : styles.statusBadgeActive;
      
      return (
        <span className={`${styles.statusBadge} ${badgeClass}`}>
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
          className={styles.actionLink}
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
    <div className={styles.tableContainer}>
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
        className={styles.table}
        rowClassName={(record, index) => 
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
      />
    </div>
  );
};

export default BuyerTable;
