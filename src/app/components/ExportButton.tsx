"use client";

import { Button } from "antd";
import Link from "next/link";
import { SearchParams } from "../types/buyer";

export default function ExportButton({ filters }: { filters: SearchParams }) {
  
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
    )
  ).toString();

  const exportUrl = `/api/buyers/export${query ? `?${query}` : ""}`;

  return (
    <Link
      href={exportUrl}
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
