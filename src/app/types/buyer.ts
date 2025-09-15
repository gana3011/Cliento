// types/buyer.ts
import type { Buyer as BuyerType } from "@prisma/client";

export interface SearchParams {
  page?: string;
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  search?: string;
}

export interface PageProps {
  searchParams: Promise<SearchParams>;
}

export interface BuyerProps {
  data: BuyerType[];
  total: number;
  currentPage: number;
  pageSize: number;
  filters: {
    page?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    search?: string;
  };
  filterOptions: {
    cities: string[];
    propertyTypes: string[];
    statuses: string[];
    timelines: string[];
  };
}

export interface BuyerActionsProps {
  filters: {
    page?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    search?: string;
  };
  filterOptions: {
    cities: string[];
    propertyTypes: string[];
    statuses: string[];
    timelines: string[];
  };
}

export interface BuyerFiltersProps {
  filters: {
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
  };
  filterOptions: {
    cities: string[];
    propertyTypes: string[];
    statuses: string[];
    timelines: string[];
  };
  onFilterChange: (key: string, value: string) => void;
}

export interface BuyerImportExportProps {
  filters: {
    page?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
    search?: string;
  };
}

export interface BuyerSearchBarProps {
  initialValue: string;
  onSearch: (value: string) => void;
}

export type BuyerFormProps = {
  form: any;
  initialValues?: any;
  onSubmit?: (values: any) => Promise<void> | void;
};

export interface BuyerTableProps {
  data: BuyerType[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export interface BuyerRow {
  key: string;
  fullName: string;
  phone: string;
  city: string;
  propertyType: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline: string;
  status: string;
  updatedAt: string;
}