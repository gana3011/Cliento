import { buyerBase } from "@/app/lib/validators/buyer";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/app/lib/supabase/supabaseServerClient";

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log(body);
  
  const parsed = buyerBase.safeParse(body);
  if (!parsed.success) {
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
    const res = await prisma.buyer.create({
      data: {
        ...parsed.data,
        ownerId,
      },
    });

    return NextResponse.json({ success: true, buyer: res });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: "DB error" },
      { status: 500 }
    );
  }
}