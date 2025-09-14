import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
// @ts-ignore
import { Parser } from "json2csv";
import { supabaseServerClient } from "@/app/lib/supabase/supabaseServerClient";


interface SearchParams {
  city?: string;
  propertyType?: string;
  status?: string;
  timeline?: string;
  search?: string;
}

export async function GET(req: Request) {
    const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const params: SearchParams = {
    city: searchParams.get("city") || undefined,
    propertyType: searchParams.get("propertyType") || undefined,
    status: searchParams.get("status") || undefined,
    timeline: searchParams.get("timeline") || undefined,
    search: searchParams.get("search") || undefined,
  };

  console.log(params);

  const { search, city, propertyType, status, timeline } = params;

  const where: Prisma.BuyerWhereInput = {
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
            { email: { contains: search, mode: "insensitive" } },
            { notes: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(city ? { city: city as any } : {}),
    ...(propertyType ? { propertyType: propertyType as any } : {}),
    ...(status ? { status: status as any } : {}),
    ...(timeline ? { timeline: timeline as any } : {}),
  };

  try {
    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Convert to CSV
    const parser = new Parser({
      fields: [
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
      ],
    });

    const csv = parser.parse(
      buyers.map((b) => ({
        ...b,
        tags: b.tags?.join(",") ?? "",
      }))
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=buyers.csv",
      },
    });
  } catch (err) {
    console.error("CSV export error:", err);
    return NextResponse.json({ ok: false, message: "Failed to export buyers" }, { status: 500 });
  }
}
