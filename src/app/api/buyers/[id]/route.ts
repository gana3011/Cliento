import { prisma } from "@/app/lib/prisma";
import { supabaseServerClient } from "@/app/lib/supabase/supabaseServerClient";
import { buyerBase } from "@/app/lib/validators/buyer";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await req.json();

  const parsed = buyerBase.safeParse(body);

  if (!parsed.success) {
    console.log(parsed.error?.issues);
    return NextResponse.json(parsed.error, { status: 400 });
  }

  const data = parsed.data;

  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const existingBuyer = await prisma.buyer.findUnique({ where: { id } });
  if (!existingBuyer)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existingBuyer.ownerId != user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const clientUpdatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
  if (!clientUpdatedAt)
    return NextResponse.json(
      { message: "Missing updatedAt for concurrency check" },
      { status: 400 }
    );

  const serverUpdatedAt = existingBuyer.updatedAt;
  if (serverUpdatedAt.getTime() !== clientUpdatedAt.getTime())
    return NextResponse.json(
      {
        ok: false,
        message: "Record changed, please refresh",
        current: existingBuyer,
      },
      { status: 409 }
    );

  const fields: Array<keyof typeof data> = [
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
  ] as any;

  const diff: Record<string, { before: any; after: any }> = {};
  for (const key of fields) {
    // @ts-ignore
    const before = (existingBuyer as any)[key];
    // @ts-ignore
    const after = (data as any)[key];

    const same =
      JSON.stringify(before ?? null) === JSON.stringify(after ?? null);
    if (!same) diff[key] = { before, after };
  }

  try {
    const result = await prisma.$transaction(async (prismaTx) => {
      const updatedBuyer = await prismaTx.buyer.update({
        where: { id },
        data: data,
      });

      const history = await prismaTx.buyerHistory.create({
        data: {
          buyerId: id,
          changedBy: user.id,
          diff,
        },
      });

      return { updatedBuyer, history };
    });
    return NextResponse.json({ buyer: result.updatedBuyer }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
