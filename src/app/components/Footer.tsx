"use client";

import React from "react";
import { ConfigProvider } from "antd";

const Footer = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#A9BD93',
          colorText: '#2D4A32',
        },
      }}
    >
      <footer
        style={{
          backgroundColor: '#A9BD93',
          padding: '0.5rem 0',
          marginTop: 'auto',
          color: '#FFFDF6',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Left side - Brand */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h3
              style={{
                color: '#FFFDF6',
                margin: '0 0 0.5rem 0',
                fontSize: '1.5rem',
                fontWeight: '600',
              }}
            >
              Cliento
            </h3>
            <p
              style={{
                color: '#FFFDF6',
                margin: '0',
                opacity: '0.9',
                fontSize: '0.9rem',
              }}
            >
              Real Estate CRM for Modern Agents
            </p>
          </div>
          {/* Right side - Copyright */}
          <div
            style={{
              textAlign: 'right',
              flex: '1',
              minWidth: '200px',
            }}
          >
            <p
              style={{
                color: '#FFFDF6',
                margin: '0',
                fontSize: '0.85rem',
                opacity: '0.8',
              }}
            >
              © {new Date().getFullYear()} Cliento
            </p>
            <p
              style={{
                color: '#FFFDF6',
                margin: '0',
                fontSize: '0.8rem',
                opacity: '0.7',
              }}
            >
              Built with Next.js & Ant Design
            </p>
          </div>
        </div>

        {/* Mobile responsive adjustments */}
        <style jsx>{`
          @media (max-width: 768px) {
            footer > div {
              flex-direction: column !important;
              text-align: center !important;
            }
            
            footer > div > div {
              text-align: center !important;
              min-width: 100% !important;
            }
            
            footer > div > div:nth-child(2) {
              order: 3;
            }
          }
        `}</style>
      </footer>
    </ConfigProvider>
  );
};

export default Footer;
