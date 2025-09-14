'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase/supabaseClient';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
}

export default function LoginPage() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | undefined>();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setMessage('');
    setMessageType(undefined);

    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } else {
      setMessage('Check your email for the magic link!');
      setMessageType('success');
      form.resetFields();
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>Welcome Back</Title>
            <Text type="secondary">Sign in with your email to continue</Text>
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
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
              </Button>
            </Form.Item>
          </Form>

          {message && (
            <Alert
              message={message}
              type={messageType}
              showIcon
              closable
              onClose={() => {
                setMessage('');
                setMessageType(undefined);
              }}
            />
          )}
        </Space>
      </Card>
    </div>
  );
}
