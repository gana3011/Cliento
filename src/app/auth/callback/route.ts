import { NextRequest, NextResponse } from 'next/server'
import { supabaseServerClient } from '@/app/lib/supabase/supabaseServerClient'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/buyers'

  const redirectOrigin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
  console.log('Redirect origin:', redirectOrigin)
  console.log('Auth code received:', code ? 'Yes' : 'No')
  console.log('Full URL:', request.url)

  if (code) {
    const supabase = await supabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Session exchange error:', error)
    if (!error) {
      console.log('Auth successful, redirecting to:', `${redirectOrigin}${next}`)
      return NextResponse.redirect(`${redirectOrigin}${next}`)
    }
  }

  console.log('Auth failed, redirecting to login with error')
  return NextResponse.redirect(`${redirectOrigin}/login?error=Could not authenticate user`)
}
