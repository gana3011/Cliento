import { buyerBase } from "@/app/lib/validators/buyer";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/app/lib/supabase/supabaseServerClient";
import { PrismaClient } from "@/generated/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const parsed = buyerBase.safeParse(body);
  if (!parsed.success) {
    console.log(parsed.error?.issues);
    return NextResponse.json(parsed.error, { status: 400 });
  }

  try {
    const supabase = await supabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const ownerId = user.id;
    const result = await prisma.$transaction(async (prismaTx: PrismaClient) => {
 
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

    return NextResponse.json({ success: true, result }, {status: 201});
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: "DB error" },
      { status: 500 }
    );
  }
}