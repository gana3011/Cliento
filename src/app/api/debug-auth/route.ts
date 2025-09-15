import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const debugInfo = {
    url: request.url,
    origin: new URL(request.url).origin,
    env_app_url: process.env.NEXT_PUBLIC_APP_URL,
    env_supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    all_params: Object.fromEntries(searchParams.entries()),
    headers: Object.fromEntries(request.headers.entries())
  }
  
  return NextResponse.json(debugInfo, { status: 200 })
}
