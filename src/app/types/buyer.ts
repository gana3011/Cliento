export type Buyer = {
  id: string;
  fullName: string;
  email?: string | null;
  phone: string;
  city: string;
  propertyType: string;
  bhk?: string | null;
  purpose: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline: string;
  source: string;
  status: string,
  tags: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date,
};

export type BuyerProps = {
  data: Buyer[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  searchParams?: {
    page?: string;
    q?: string;
    city?: string;
    propertyType?: string;
    status?: string;
    timeline?: string;
  };
};