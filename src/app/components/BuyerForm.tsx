"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, InputNumber, Row, Col, ConfigProvider } from "antd";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

const { Option } = Select;

type BuyerFormProps = {
  form: any;
  initialValues?: any;
  onSubmit?: (values: any) => Promise<void> | void;
};

const BuyerForm = ( {form, initialValues, onSubmit } : BuyerFormProps) => {
  const router = useRouter();
  
  const pathname = usePathname();


  const [propertyType, setPropertyType] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (initialValues?.propertyType) {
      setPropertyType(initialValues.propertyType);
    }
    console.log(initialValues);
  }, [initialValues]);

  const onFinish = async (values: any) => {
    console.log("form onFinish triggered:", values);
    try {
      if(onSubmit){
        await onSubmit(values);
      }
      else{
      const res = await axios.post("/api/buyers/new", values);
      form.resetFields();
      router.replace('/buyers');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#A9BD93',
          colorPrimaryHover: '#A9BD93',
          colorPrimaryActive: '#A9BD93',
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
      <Form 
        layout="vertical" 
        form={form} 
        onFinish={onFinish} 
        initialValues={initialValues}
      >
      <Row gutter={16}>
        {/* Left Column */}
        <Col span={12}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Select placeholder="Select city">
              <Option value="Chandigarh">Chandigarh</Option>
              <Option value="Mohali">Mohali</Option>
              <Option value="Zirakpur">Zirakpur</Option>
              <Option value="Panchkula">Panchkula</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="propertyType" label="Property Type" rules={[{ required: true }]}>
            <Select
              placeholder="Select property type"
              onChange={(value) => setPropertyType(value)}
            >
              <Option value="Apartment">Apartment</Option>
              <Option value="Villa">Villa</Option>
              <Option value="Plot">Plot</Option>
            </Select>
          </Form.Item>

          {(propertyType === "Apartment" || propertyType === "Villa") && (
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
          <Form.Item name="purpose" label="Purpose" rules={[{ required: true }]}>
            <Select placeholder="Select purpose">
              <Option value="Buy">Buy</Option>
              <Option value="Rent">Rent</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Budget (Min / Max)" style={{ marginBottom: 0 }}>
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

          <Form.Item name="timeline" label="Timeline" rules={[{ required: true }]}>
            <Select placeholder="Select timeline">
              <Option value="ZERO-3m">0-3 months</Option>
              <Option value="THREE_6M">3-6 months</Option>
              <Option value="GT_6M">6+ months</Option>
              <Option value="Exploring">Exploring</Option>
            </Select>
          </Form.Item>

          <Form.Item name="source" label="Source" rules={[{ required: true }]}>
            <Select placeholder="Select source">
              <Option value="Website">Website</Option>
              <Option value="Referral">Referral</Option>
              <Option value="Walk_in">Walk-in</Option>
              <Option value="Call">Call</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          {(!pathname.includes('new')) && (
            <Form.Item name="status" label="Status">
              <Select placeholder="Select source">
              <Option value="New">New</Option>
              <Option value="Qualified">Qualified</Option>
              <Option value="Contacted">Contacted</Option>
              <Option value="Visited">Visited</Option>
              <Option value="Negotiation">Negotiation</Option>
              <Option value="Converted">Converted</Option>
              <Option value="Dropped">Dropped</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add tags"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="notes" label="Notes">
        <Input.TextArea rows={3} placeholder="Additional notes" />
      </Form.Item>

      <Form.Item name="updatedAt" hidden>
          <Input type="hidden" />
        </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit"
          style={{
            backgroundColor: '#A9BD93',
            borderColor: '#A9BD93',
            fontWeight: '500',
            height: '40px',
            borderRadius: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFDF6';
            e.currentTarget.style.color = '#A9BD93';
            e.currentTarget.style.borderColor = '#A9BD93';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#A9BD93';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = '#A9BD93';
          }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
    </ConfigProvider>
  );
};

export default BuyerForm;
