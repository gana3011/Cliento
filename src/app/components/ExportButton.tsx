"use client";

import { Button } from "antd";
import Link from "next/link";
import { useEffect } from "react";

interface SearchParams {
  page?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  search?: string;
}

export default function ExportButton({ filters }: { filters: SearchParams }) {
  // Remove undefined/empty filters
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
    )
  ).toString();

  const exportUrl = `/api/buyers/export${query ? `?${query}` : ""}`;


  return (
    <Link
      href={exportUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
        <Button
          style={{
            borderColor: '#d9d9d9'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#D97706';
            e.currentTarget.style.color = '#D97706';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d9d9d9';
            e.currentTarget.style.color = '';
          }}
        >
          Export as CSV
        </Button>
    </Link>
  );
}
