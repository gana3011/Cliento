import { prisma } from "@/app/lib/prisma";
import { supabaseServerClient } from "@/app/lib/supabase/supabaseServerClient";
import { buyerBase } from "@/app/lib/validators/buyer";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { updateBuyerLimiter, getIdentifier } from "@/app/lib/rate-limiter";

function formatZodErrors(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
      return `${path}${issue.message}`;
    })
    .join(', ');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const body = await request.json();

  const parsed = buyerBase.safeParse(body);

  if (!parsed.success) {
    const errorMessage = formatZodErrors(parsed.error);
    return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });
  }

  const data = parsed.data;

  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 });
  }

  // **RATE LIMITING CALL**
  const identifier = getIdentifier(request, user.id);
  const { success, limit, remaining, reset } = await updateBuyerLimiter.limit(identifier);
  
  if (!success) {
    return NextResponse.json(
      { 
        ok: false, 
        message: `Rate limit exceeded. You can update ${limit} buyers per minute. Try again later.` 
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

  const existingBuyer = await prisma.buyer.findUnique({ where: { id } });
  if (!existingBuyer)
    return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });

  if (existingBuyer.ownerId != user.id)
    return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });

  const clientUpdatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
  if (!clientUpdatedAt)
    return NextResponse.json(
      { 
        ok: false, 
        message: "Missing updatedAt for concurrency check" 
      },
      { status: 400 }
    );

  const serverUpdatedAt = existingBuyer.updatedAt;
  if (Math.abs(serverUpdatedAt.getTime() - clientUpdatedAt.getTime())>500)
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
    return NextResponse.json({ ok: true, buyer: result.updatedBuyer }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
