import { z } from "zod";

export const BHKValues = ["BHK1","BHK2","BHK3","BHK4","Studio"] as const;
export const CityValues = ["Chandigarh","Mohali","Zirakpur","Panchkula","Other"] as const;

export const buyerBase = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  phone: z.string().regex(/^\d{10,15}$/, "phone must be 10-15 digits"),
  city: z.enum(CityValues),
  propertyType: z.enum(["Apartment","Villa","Plot","Office","Retail"] as const),
  bhk: z.union([z.enum(BHKValues), z.undefined(), z.null()]),
  purpose: z.enum(["Buy","Rent"] as const),
  budgetMin: z.number().int().positive().optional().nullable(),
  budgetMax: z.number().int().positive().optional().nullable(),
  timeline: z.enum(["0-3m","3-6m",">6m","Exploring"] as const),
  source: z.enum(["Website","Referral","Walk-in","Call","Other"] as const),
  notes: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
});

// refine for bhk required for Apartment/Villa and budgetMax >= budgetMin
export const createBuyerSchema = buyerBase.superRefine((data, ctx) => {
  if ((data.propertyType === "Apartment" || data.propertyType === "Villa") && !data.bhk) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "bhk required for Apartment/Villa", path: ["bhk"] });
  }
  if (data.budgetMin != null && data.budgetMax != null && data.budgetMax < data.budgetMin) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "budgetMax must be >= budgetMin", path: ["budgetMax"] });
  }
});
