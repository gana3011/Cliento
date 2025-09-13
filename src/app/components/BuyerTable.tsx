'use client';

import { Space, Table, TableProps } from 'antd';
import React, { useEffect } from 'react'
import { BuyerProps } from '../types/buyer';
import dayjs from 'dayjs';

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
};

const timelineMap: Record<string, string> = {
    ZERO_3M : '0-3m',
    THREE_6M : '3-6m',
    GT_6M : '>6m',
    OTHER : 'other'
}

const columns: TableProps<BuyerRow>['columns'] = [
    {
        title: 'Name',
        dataIndex: 'fullName',
        key: 'fullName',
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: 'PropertyType',
        dataIndex: 'propertyType',
        key: 'propertyType',
    },
    {
        title: 'Budget Min',
        dataIndex: 'budgetMin',
        key: 'budgetMin',
    },
    {
        title: 'Budget Max',
        dataIndex: 'budgetMax',
        key: 'budgetMax',
    },
    {
        title: 'Timeline',
        dataIndex: 'timeline',
        key: 'timeline',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'UpdatedAt',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
    },
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
]

const BuyerTable = ( { data }: BuyerProps) => {

    const buyerData = data.map(b=>{
        return{
        key: b.id,
        fullName: b.fullName,
        phone: b.phone,
        city: b.city,
        propertyType: b.propertyType,
        budgetMin: b.budgetMin,
        budgetMax: b.budgetMax,
        timeline: timelineMap[b.timeline],
        status: b.status,
        updatedAt: dayjs(b.updatedAt).format("DD MMM YYY, hh:mm A"),
        };
    });

  return (
    <div>
        <Table<BuyerRow> columns={columns} dataSource={buyerData} />
    </div>
  )
}

export default BuyerTable;