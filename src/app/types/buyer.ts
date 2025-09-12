export type Buyer = {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  city: string;
  propertyType: string;
  bhk?: string;
  purpose: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline: string;
  source: string;
  tags: string[];
  ownerId: string;
};

export type BuyerProps = {
  data: Buyer[];
};