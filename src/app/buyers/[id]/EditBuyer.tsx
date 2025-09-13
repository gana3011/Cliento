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

    console.log('values',values); 

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
    <div>
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

    <h3>History (last 5)</h3>
      <ul>
        {history.map((h) => (
          <li key={h.id}>
            <strong>{h.changedBy}</strong> at {dayjs(h.changedAt).format("DD MMM YYYY, hh:mm A")}
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(h.diff, null, 2)}</pre>
          </li>
        ))}
      </ul>
  </div>
  );
};

export default EditBuyer;
