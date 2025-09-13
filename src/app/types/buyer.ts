// types/buyer.ts
import type { Buyer as BuyerType } from "@prisma/client";

export interface BuyerProps {
  data: BuyerType[];
  total?: number;
  currentPage?: number;
  pageSize?: number;
  filters?: {
    page?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    search?: string;
  };
  filterOptions?: {
    cities: string[];
    propertyTypes: string[];
    statuses: string[];
    timelines: string[];
  };
}