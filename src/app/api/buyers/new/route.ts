import { buyerBase } from "@/app/lib/validators/buyer";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request: NextRequest){
    const body = await request.json();
    console.log(body);
    const parsed = buyerBase.safeParse(body);
    console.log(parsed)
    
    if (!parsed.success) {
    return NextResponse.json(parsed.error, { status: 400 });
    }

    return NextResponse.json({success: true});
}