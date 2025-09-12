'use client';

import React, { useState } from 'react';
import { Button, Form, Input, Select, InputNumber, Row, Col } from 'antd';
import axios from 'axios';

const { Option } = Select;

const BuyerForm = () => {
  const [form] = Form.useForm();
  const [propertyType, setPropertyType] = useState<string | undefined>(undefined);

  const onFinish = async(values: any) => {
    try{
      const res = await axios.post('/api/buyers/new', values);
      console.log(res.data);
    } catch(err){
      console.error(err);
    } 
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
    >
      <Row gutter={16}>
        {/* Left Column */}
        <Col span={12}>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="city" label="City">
            <Input placeholder="Enter city" />
          </Form.Item>

          <Form.Item name="propertyType" label="Property Type">
            <Select
              placeholder="Select property type"
              onChange={(value) => setPropertyType(value)}
            >
              <Option value="Apartment">Apartment</Option>
              <Option value="Villa">Villa</Option>
              <Option value="Plot">Plot</Option>
            </Select>
          </Form.Item>

          {(propertyType === 'Apartment' || propertyType === 'Villa') && (
            <Form.Item name="bhk" label="BHK">
              <Select placeholder="Select BHK">
                <Option value="BHK1">1 BHK</Option>
                <Option value="BHK2">2 BHK</Option>
                <Option value="BHK3">3 BHK</Option>
                <Option value="BHK4">4 BHK</Option>
                <Option value="Studio">Studio</Option>
              </Select>
            </Form.Item>
          )}
        </Col>

        {/* Right Column */}
        <Col span={12}>
          <Form.Item name="purpose" label="Purpose">
            <Select placeholder="Select purpose">
              <Option value="Buy">Buy</Option>
              <Option value="Rent">Rent</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Budget (Min / Max)" style={{ marginBottom: 0 }}>
            <Row gutter={8}>
              <Col span={11}>
                <Form.Item name="budgetMin" noStyle>
                  <InputNumber placeholder="Min" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={2} style={{ textAlign: 'center' }}>-</Col>
              <Col span={11}>
                <Form.Item name="budgetMax" noStyle>
                  <InputNumber placeholder="Max" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item name="timeline" label="Timeline">
            <Select placeholder="Select timeline">
              <Option value="ZERO-3m">0-3 months</Option>
              <Option value="THREE_6M">3-6 months</Option>
              <Option value="GT_6M">6+ months</Option>
              <Option value="Exploring">Exploring</Option>
            </Select>
          </Form.Item>

          <Form.Item name="source" label="Source">
            <Select placeholder="Select source">
              <Option value="Website">Website</Option>
              <Option value="Referral">Referral</Option>
              <Option value="Walk-in">Walk-in</Option>
              <Option value="Call">Call</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select mode="tags" style={{ width: '100%' }} placeholder="Add tags" />
          </Form.Item>
        </Col>
      </Row>

      {/* Notes (Full Width) */}
      <Form.Item name="notes" label="Notes">
        <Input.TextArea rows={3} placeholder="Additional notes" />
      </Form.Item>

      {/* Submit */}
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};

export default BuyerForm;
