import { NextRequest, NextResponse } from "next/server";
import { parse as csvParse } from "csv-parse/sync";
import { supabaseServerClient } from "@/app/lib/supabase/supabaseServerClient";
import { buyerBase } from "@/app/lib/validators/buyer";
import { prisma } from "@/app/lib/prisma";
import { importBuyerLimiter, getIdentifier } from "@/app/lib/rate-limiter";
import type { Buyer } from "@prisma/client";
import { z } from "zod";
import { CSVRow } from "@/app/types/buyer";

// Type for validated buyer data
type ValidatedBuyerData = z.infer<typeof buyerBase>;

const MAX_ROWS = 200;
const EXPECTED_HEADERS = [
  "fullName",
  "email",
  "phone",
  "city",
  "propertyType",
  "bhk",
  "purpose",
  "budgetMin",
  "budgetMax",
  "timeline",
  "source",
  "notes",
  "tags",
  "status",
];

const timelineMap: Record<
  string,
  "ZERO_3M" | "THREE_6M" | "GT_6M" | "Exploring"
> = {
  "0-3m": "ZERO_3M",
  "3-6m": "THREE_6M",
  "6+m": "GT_6M",
  exploring: "Exploring",
};

const bhkMap: Record<string, "BHK1" | "BHK2" | "BHK3" | "BHK4" | "Studio"> = {
  "1bhk": "BHK1",
  "2bhk": "BHK2",
  "3bhk": "BHK3",
  "4bhk": "BHK4",
  studio: "Studio",
};

export async function POST(request: NextRequest) {

    const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  // **RATE LIMITING CALL**
  const identifier = getIdentifier(request, user.id);
  const { success, limit, remaining, reset } = await importBuyerLimiter.limit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { 
        ok: false, 
        message: `Rate limit exceeded. You can import ${limit} files per 5 minutes. Try again later.` 
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        }
      }
    );
  }

  let csvText: string;
  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file)
      return NextResponse.json({ ok:false, message: "No file" }, { status: 400 });
    csvText = await file.text();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Cannot read request body" },
      { status: 400 }
    );
  }

  let records: CSVRow[];
  try {
    const parsed = csvParse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    records = Array.isArray(parsed) ? parsed as CSVRow[] : [];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, message: "Invalid CSV", error: errorMessage },
      { status: 400 }
    );
  }

  if (records.length === 0) {
    return NextResponse.json(
      { ok: false, message: "CSV is empty" },
      { status: 400 }
    );
  }
  if (records.length > MAX_ROWS) {
    return NextResponse.json(
      {
        ok: false,
        message: `Max ${MAX_ROWS} rows allowed`,
        count: records.length,
      },
      { status: 400 }
    );
  }

  const headerKeys = Object.keys(records[0]);
  const missing = EXPECTED_HEADERS.filter((h) => !headerKeys.includes(h));
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, message: "Missing headers", missing },
      { status: 400 }
    );
  }

  const ownerId = user.id;

  const errors: { row: number; errors: string[] }[] = [];
  const validRows: ValidatedBuyerData[] = [];

  records.forEach((r: CSVRow, idx: number) => {
     const rowNum = idx + 2; // header occupies row 1
    const rowErrors: string[] = [];
    const zodIn = {
      fullName: r.fullName?.trim(),
      email: r.email?.trim() || null,
      phone: r.phone?.trim(),
      city: r.city?.trim() as "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other",
      propertyType: r.propertyType?.trim() as "Apartment" | "Villa" | "Plot" | "Office" | "Retail",
      bhk: r.bhk
        ? bhkMap[r.bhk.trim().toLowerCase()] ?? (r.bhk as "BHK1" | "BHK2" | "BHK3" | "BHK4" | "Studio")
        : undefined,
      purpose: r.purpose?.trim() as "Buy" | "Rent",
      budgetMin: r.budgetMin ? Number(r.budgetMin) : null,
      budgetMax: r.budgetMax ? Number(r.budgetMax) : null,
      timeline: r.timeline
        ? timelineMap[r.timeline.trim().toLowerCase()] ?? (r.timeline as "ZERO_3M" | "THREE_6M" | "GT_6M" | "Exploring")
        : undefined,
      source: r.source?.trim() as "Website" | "Referral" | "Walk_in" | "Call" | "Other",
      notes: r.notes?.trim() || null,
      tags: r.tags
        ? r.tags
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [],
      status: r.status?.trim() as "New" | "Qualified" | "Contacted" | "Visited" | "Negotiation" | "Converted" | "Dropped" | undefined,
      updatedAt: new Date().toISOString(),
    };

    const parsed = buyerBase.safeParse(zodIn);
    if(!parsed.success){
        const issues = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`);
      rowErrors.push(...issues);
    }

    if (rowErrors.length > 0) {
      errors.push({ row: rowNum, errors: rowErrors });
    } else if (parsed.success) {
      validRows.push(parsed.data);
    }
    });

    if (errors.length > 0) {
    return NextResponse.json({ ok: false, message: "Row validation errors", errors, validCount: validRows.length }, { status: 400 });
  }

  try {
    const inserted: Buyer[] = [];
    await prisma.$transaction(async (tx) => {
      for (const r of validRows) {
        const created = await tx.buyer.create({
          data: {
            ...r,
            // ensure ownerId set
            ownerId,
            // if tags was string[], ensure correct type
            tags: r.tags ?? [],
          },
        });

        // create history entry
        await tx.buyerHistory.create({
          data: {
            buyerId: created.id,
            changedBy: ownerId,
            diff: { imported: true },
          },
        });

        inserted.push(created);
      }
    });

    return NextResponse.json({ ok: true, inserted: inserted.length });
  } catch (err) {
    console.error("Import DB error:", err);
    return NextResponse.json({ ok: false, message: "DB insert error" }, { status: 500 });
  }
}
