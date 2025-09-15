import { buyerBase } from "@/app/lib/validators/buyer";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/app/lib/supabase/supabaseServerClient";
import { ZodError } from "zod";
import { createBuyerLimiter, getIdentifier } from "@/app/lib/rate-limiter";

// Helper function to format Zod validation errors
function formatZodErrors(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
      return `${path}${issue.message}`;
    })
    .join(', ');
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const parsed = buyerBase.safeParse(body);
  if (!parsed.success) {
    const errorMessage = formatZodErrors(parsed.error);
    return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });
  }

  try {
    const supabase = await supabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 });
    }

   // **RATE LIMITING CALL**
    const identifier = getIdentifier(request, user.id);
    const { success, limit, remaining, reset } = await createBuyerLimiter.limit(identifier);
    
    if (!success) {
      return NextResponse.json(
        { 
          ok: false, 
          message: `Rate limit exceeded. You can create ${limit} buyers per minute. Try again later.` 
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

    const ownerId = user.id;
    const result = await prisma.$transaction(async (prismaTx ) => {
 
  const buyer = await prismaTx.buyer.create({
    data: {
      ...parsed.data,
      ownerId,
    },
  });

  const buyerHistory = await prismaTx.buyerHistory.create({
    data: {
      buyerId: buyer.id,
      changedBy: ownerId,
       diff: {}
    },
  });

  return { buyer, buyerHistory };
});

    return NextResponse.json({ ok: true, message: "Buyer added successfully" }, {status: 201});
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { ok: false, message: "Database error occurred" },
      { status: 500 }
    );
  }
}