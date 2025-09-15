'use client';

import React, { useEffect } from "react";
import type { Buyer } from "@prisma/client";
import type { BuyerHistory as History } from "@prisma/client";
import { Form } from "antd";
import BuyerForm from "@/app/components/BuyerForm";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

type Props = {
  buyer: Buyer;
  history: History[];
};

const EditBuyer = ({ buyer, history }: Props) => {
  const [form] = Form.useForm();

  const router = useRouter();

  const handleSubmit = async (values: any) => {

    try{
      const res  = await fetch(`/api/buyers/${buyer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (res.status === 409) {
        const payload = await res.json();
        console.log("server current record:", payload?.current);
        return;
      }

      if(!res.ok){
        const err = await res.json();
        console.error(err);
        return;
      }

      const data = await res.json();
      if (data.buyer?.updatedAt) {
        form.setFieldValue("updatedAt", new Date(data.buyer.updatedAt).toISOString());
      }
      router.replace("/buyers");
    } catch(error){
      console.error(error);
    }
  }
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFDF6' }}>
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
            marginBottom: '2rem'
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
            Edit Buyer
          </h1>
          <BuyerForm form={form} initialValues={
            {
            fullName: buyer.fullName ?? null,
            email: buyer.email ?? null,
            phone: buyer.phone ?? null,
            city: buyer.city,
            propertyType: buyer.propertyType,
            bhk: buyer.bhk ?? undefined,
            purpose: buyer.purpose,
            budgetMin: buyer.budgetMin ?? undefined,
            budgetMax: buyer.budgetMax ?? undefined,
            timeline: buyer.timeline,
            source: buyer.source,
            status: buyer.status,
            notes: buyer.notes ?? null,
            tags: buyer.tags ?? [],
            updatedAt: buyer.updatedAt.toISOString(),
          }}
          onSubmit={handleSubmit}
          />
        </div>

        <div
          style={{
            background: '#FFFDF6',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #A9BD93',
            boxShadow: '0 4px 12px rgba(169, 189, 147, 0.1)',
          }}
        >
          <h3 
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#2D4A32',
              marginBottom: '1.5rem',
              borderBottom: '2px solid #A9BD93',
              paddingBottom: '0.5rem'
            }}
          >
            History (last 5)
          </h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {history.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {history.map((h) => (
                  <li 
                    key={h.id}
                    style={{
                      padding: '1rem',
                      marginBottom: '1rem',
                      backgroundColor: '#F8F9FA',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      borderLeft: '4px solid #A9BD93'
                    }}
                  >
                    <div style={{ 
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: '#6B7280'
                    }}>
                      <strong style={{ color: '#2D4A32' }}>{h.changedBy}</strong> at {dayjs(h.changedAt).format("DD MMM YYYY, hh:mm A")}
                    </div>
                    <pre style={{ 
                      whiteSpace: "pre-wrap",
                      backgroundColor: '#FFFFFF',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      fontSize: '0.8rem',
                      margin: 0,
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(h.diff, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ 
                color: '#6B7280',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '2rem'
              }}>
                No history available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBuyer;
