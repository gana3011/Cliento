'use client';

import { Button } from "antd";
import Link from "next/link";
import { UserAddOutlined, TeamOutlined, FileExcelOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFDF6' }}>
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 2rem',
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 
            style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#2D4A32',
              marginBottom: '1rem',
            }}
          >
            Welcome to Cliento
          </h1>
          <p
            style={{
              fontSize: '1.3rem',
              color: '#5A6F5D',
              marginBottom: '0',
              lineHeight: '1.6'
            }}
          >
            Your comprehensive buyer management solution
          </p>
        </div>

        {/* Features Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem'
          }}
        >
          <div
            style={{
              background: '#F8FBF6',
              padding: '2.5rem',
              borderRadius: '12px',
              border: '1px solid #C9D6C1',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(169, 189, 147, 0.1)',
            }}
          >
            <TeamOutlined 
              style={{ 
                fontSize: '3rem', 
                color: '#A9BD93', 
                marginBottom: '1.5rem' 
              }} 
            />
            <h3 
              style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                color: '#2D4A32',
                marginBottom: '1rem'
              }}
            >
              Manage Buyers
            </h3>
            <p style={{ color: '#5A6F5D', margin: '0', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Organize and track all your potential buyers in one place
            </p>
          </div>

          <div
            style={{
              background: '#F8FBF6',
              padding: '2.5rem',
              borderRadius: '12px',
              border: '1px solid #C9D6C1',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(169, 189, 147, 0.1)',
            }}
          >
            <UserAddOutlined 
              style={{ 
                fontSize: '3rem', 
                color: '#A9BD93', 
                marginBottom: '1.5rem' 
              }} 
            />
            <h3 
              style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                color: '#2D4A32',
                marginBottom: '1rem'
              }}
            >
              Add New Leads
            </h3>
            <p style={{ color: '#5A6F5D', margin: '0', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Quickly add new buyer information and track their preferences
            </p>
          </div>

          <div
            style={{
              background: '#F8FBF6',
              padding: '2.5rem',
              borderRadius: '12px',
              border: '1px solid #C9D6C1',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(169, 189, 147, 0.1)',
            }}
          >
            <FileExcelOutlined 
              style={{ 
                fontSize: '3rem', 
                color: '#A9BD93', 
                marginBottom: '1.5rem' 
              }} 
            />
            <h3 
              style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                color: '#2D4A32',
                marginBottom: '1rem'
              }}
            >
              Import & Export
            </h3>
            <p style={{ color: '#5A6F5D', margin: '0', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Bulk import from CSV files and export your data anytime
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}
        >
          <Link href="/buyers">
            <Button
              type="primary"
              size="large"
              icon={<TeamOutlined />}
              style={{
                backgroundColor: '#A9BD93',
                borderColor: '#A9BD93',
                fontSize: '1.1rem',
                height: '3.5rem',
                padding: '0 2.5rem'
              }}
            >
              View All Buyers
            </Button>
          </Link>
          
          <Link href="/buyers/new">
            <Button
              size="large"
              icon={<UserAddOutlined />}
              style={{
                borderColor: '#A9BD93',
                color: '#2D4A32',
                fontSize: '1.1rem',
                height: '3.5rem',
                padding: '0 2.5rem'
              }}
            >
              Add New Buyer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
