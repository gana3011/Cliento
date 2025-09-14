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
        <Button>
      Export as CSV
      </Button>
    </Link>
  );
}
