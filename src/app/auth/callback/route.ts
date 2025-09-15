import { NextRequest, NextResponse } from 'next/server'
import { supabaseServerClient } from '@/app/lib/supabase/supabaseServerClient'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/buyers'

  const redirectOrigin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin

  if (code) {
    const supabase = await supabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${redirectOrigin}${next}`)
    }
  }

  return NextResponse.redirect(`${redirectOrigin}/login?error=Could not authenticate user`)
}
