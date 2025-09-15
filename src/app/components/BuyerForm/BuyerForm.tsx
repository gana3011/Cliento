"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, InputNumber, Row, Col, ConfigProvider, message } from "antd";
import { usePathname, useRouter } from "next/navigation";
import styles from "./BuyerForm.module.css";
import { BuyerFormProps } from "@/app/types/buyer";
import { z } from "zod";
import { buyerBase } from "@/app/lib/validators/buyer";

// Type for form values
type BuyerFormValues = z.infer<typeof buyerBase>;

const { Option } = Select;

const BuyerForm = ( {form, initialValues, onSubmit } : BuyerFormProps) => {
  const router = useRouter();
  
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [propertyType, setPropertyType] = useState<string | undefined>(
    undefined
  );

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (initialValues?.propertyType) {
      setPropertyType(initialValues.propertyType);
    }
  }, [initialValues]);

  const onFinish = async (values: BuyerFormValues) => {
    setIsLoading(true);
    
    try {
      if(onSubmit){
        await onSubmit(values);
      }
      else{
        const res = await fetch("/api/buyers/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        
        const data = await res.json();
        
        if(!data.ok){
          messageApi.open({
            type: 'error',
            content: data.message || 'Failed to create buyer',
          });
        }
        else{
          messageApi.open({
            type: 'success',
            content: 'Buyer created successfully!',
          });
          form.resetFields();
          setTimeout(() => {
            router.replace('/buyers');
          }, 1000);
        }
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      messageApi.open({
        type: 'error',
        content: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
   

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#A9BD93',
          colorPrimaryHover: '#A9BD93',
          colorPrimaryActive: '#A9BD93',
          colorLink: '#A9BD93',
        },
        components: {
          Input: {
            hoverBorderColor: '#A9BD93',
            activeBorderColor: '#A9BD93',
          },
          Select: {
            hoverBorderColor: '#A9BD93',
            activeBorderColor: '#A9BD93',
            optionSelectedBg: '#A9BD93',
            optionActiveBg: '#A9BD93',
          },
          Button: {
            colorPrimary: '#A9BD93',
            colorPrimaryHover: '#FFFDF6',
            colorPrimaryActive: '#A9BD93',
          },
          Form: {
            labelColor: '#2D4A32',
          },
        },
      }}
    >
      {contextHolder}
      
      <div className={styles.container}>
        <Form 
          layout="vertical" 
          form={form} 
          onFinish={onFinish} 
          initialValues={initialValues}
          className={styles.formLayout}
        >
          <Row gutter={16}>
        {/* Left Column */}
        <Col span={12}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name!" }]}
          >
            <Input placeholder="Enter full name" autoFocus/>
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Please enter a valid email!" }]}>
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter phone number!" }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="city" label="City" rules={[{ required: true, message: "Please select a city!" }]}>
            <Select placeholder="Select city">
              <Option value="Chandigarh">Chandigarh</Option>
              <Option value="Mohali">Mohali</Option>
              <Option value="Zirakpur">Zirakpur</Option>
              <Option value="Panchkula">Panchkula</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="propertyType" label="Property Type" rules={[{ required: true, message: "Please select property type!" }]}>
            <Select
              placeholder="Select property type"
              onChange={(value) => setPropertyType(value)}
            >
              <Option value="Apartment">Apartment</Option>
              <Option value="Villa">Villa</Option>
              <Option value="Plot">Plot</Option>
              <Option value="Office">Office</Option>
              <Option value="Retail">Retail</Option>
            </Select>
          </Form.Item>

          {(propertyType === "Apartment" || propertyType === "Villa") ? (
            <Form.Item name="bhk" label="BHK">
              <Select placeholder="Select BHK">
                <Option value="BHK1">1 BHK</Option>
                <Option value="BHK2">2 BHK</Option>
                <Option value="BHK3">3 BHK</Option>
                <Option value="BHK4">4 BHK</Option>
                <Option value="Studio">Studio</Option>
              </Select>
            </Form.Item>
          ) : (
            <div style={{ height: '56px', marginBottom: '24px' }}></div>
          )}
        </Col>

        {/* Right Column */}
        <Col span={12}>
          <Form.Item name="purpose" label="Purpose" rules={[{ required: true, message: "Please select purpose!" }]}>
            <Select placeholder="Select purpose">
              <Option value="Buy">Buy</Option>
              <Option value="Rent">Rent</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Budget (Min / Max)" style={{ marginBottom: 24 }}>
            <Row gutter={8}>
              <Col span={11}>
                <Form.Item name="budgetMin" noStyle>
                  <InputNumber placeholder="Min" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={2} style={{ textAlign: "center" }}>
                -
              </Col>
              <Col span={11}>
                <Form.Item name="budgetMax" noStyle>
                  <InputNumber placeholder="Max" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item name="timeline" label="Timeline" rules={[{ required: true, message: "Please select timeline!" }]}>
            <Select placeholder="Select timeline">
              <Option value="ZERO_3m">0-3 months</Option>
              <Option value="THREE_6M">3-6 months</Option>
              <Option value="GT_6M">6+ months</Option>
              <Option value="Exploring">Exploring</Option>
            </Select>
          </Form.Item>

          <Form.Item name="source" label="Source" rules={[{ required: true, message: "Please select source!" }]}>
            <Select placeholder="Select source">
              <Option value="Website">Website</Option>
              <Option value="Referral">Referral</Option>
              <Option value="Walk_in">Walk-in</Option>
              <Option value="Call">Call</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add tags"
              options={[
                { label: 'Hot Lead', value: 'hot-lead' },
                { label: 'Follow Up', value: 'follow-up' },
                { label: 'VIP Client', value: 'vip-client' },
                { label: 'First Time Buyer', value: 'first-time-buyer' },
                { label: 'Investor', value: 'investor' },
                { label: 'Cash Buyer', value: 'cash-buyer' },
                { label: 'Loan Required', value: 'loan-required' },
                { label: 'Urgent', value: 'urgent' },
                { label: 'Price Sensitive', value: 'price-sensitive' },
                { label: 'Referral', value: 'referral' },
                { label: 'Repeat Customer', value: 'repeat-customer' },
                { label: 'High Budget', value: 'high-budget' },
                { label: 'Flexible Timeline', value: 'flexible-timeline' },
                { label: 'Location Specific', value: 'location-specific' },
                { label: 'Ready to Move', value: 'ready-to-move' },
              ]}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              showSearch
              allowClear
            />
          </Form.Item>

          {(!pathname.includes('new')) ? (
            <Form.Item name="status" label="Status">
              <Select placeholder="Select status">
                <Option value="New">New</Option>
                <Option value="Qualified">Qualified</Option>
                <Option value="Contacted">Contacted</Option>
                <Option value="Visited">Visited</Option>
                <Option value="Negotiation">Negotiation</Option>
                <Option value="Converted">Converted</Option>
                <Option value="Dropped">Dropped</Option>
              </Select>
            </Form.Item>
          ) : (
            <div style={{ height: '56px', marginBottom: '24px' }}></div>
          )}
        </Col>
      </Row>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} placeholder="Additional notes" className={styles.notesTextArea} />
          </Form.Item>

          <Form.Item name="updatedAt" hidden>
              <Input type="hidden" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
              className={`${styles.submitButton} ${isLoading ? styles.submitButtonLoading : ''}`}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default BuyerForm;
