'use client';

import BuyerForm from '@/app/components/BuyerForm'
import NavBar from '@/app/components/NavBar';
import { useForm } from 'antd/es/form/Form'
import React from 'react'

const page = () => {

  const [form] = useForm();
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFDF6' }}> 
      <NavBar />
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
        <div
          style={{
            background: '#FFFDF6',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #A9BD93',
            boxShadow: '0 4px 12px rgba(169, 189, 147, 0.1)',
          }}
        >
          <h1 
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#2D4A32',
              marginBottom: '1.5rem',
              borderBottom: '2px solid #A9BD93',
              paddingBottom: '0.5rem'
            }}
          >
            Add New Buyer
          </h1>
          <BuyerForm form={form}/>
        </div>
      </div>
    </div>
  )
}

export default page
