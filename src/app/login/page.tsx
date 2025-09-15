'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space, ConfigProvider, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase/supabaseClient';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
}

export default function LoginPage() {
  const [messageType, setMessageType] = useState<'success' | 'error' | undefined>();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      messageApi.open({
          type: 'error',
          content: error.message,
        });
    } else {
      messageApi.open({
          type: 'success',
          content: 'Check your mail for magic link',
        });
      form.resetFields();
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#A9BD93',
          colorPrimaryHover: '#A9BD93',
          colorPrimaryActive: '#A9BD93',
          colorSuccess: '#A9BD93',
        },
        components: {
          Input: {
            hoverBorderColor: '#A9BD93',
            activeBorderColor: '#A9BD93',
          },
          Button: {
            colorPrimary: '#A9BD93',
            colorPrimaryHover: '#FFFDF6',
            colorPrimaryActive: '#A9BD93',
          },
          Alert: {
            colorSuccessBg: 'rgba(169, 189, 147, 0.1)',
            colorSuccessBorder: '#A9BD93',
          },
        },
      }}
    >
      {contextHolder}
      <style jsx global>{`
        .ant-btn-primary:hover:not(:disabled) {
          border-color: #D97706 !important;
          color: #D97706 !important;
          background-color: #FFFFFF !important;
        }
      `}</style>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#FFFDF6',
        padding: '2rem'
      }}>
        <Card 
          style={{ 
            width: 420, 
            backgroundColor: '#FFFDF6',
            border: '1px solid #A9BD93',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(169, 189, 147, 0.15)' 
          }}
          bodyStyle={{ padding: '2.5rem' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title 
                level={2} 
                style={{ 
                  marginBottom: '0.5rem',
                  fontSize: '1.75rem',
                  fontWeight: '600'
                }}
              >
                Welcome to Cliento
              </Title>
              <Text 
                style={{ 
                  fontSize: '1rem' 
                }}
              >
                Sign in with your email to continue
              </Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email address',
                  },
                  {
                    type: 'email',
                    message: 'Please enter a valid email address',
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  autoComplete="email"
                  style={{
                    height: '44px',
                    borderRadius: '8px',
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: '44px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '1rem',
                  }}
                >
                  {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
}
