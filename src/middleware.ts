import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathName = request.nextUrl.pathname;

  // Redirect authenticated users from root to buyers dashboard
  if (pathName === "/" && user) {
    return NextResponse.redirect(`${request.nextUrl.origin}/buyers`);
  }

  // Protect /buyers routes
  if (pathName.startsWith("/buyers") && !user) {
    return NextResponse.redirect(`${request.nextUrl.origin}/login`);
  }

  // Protect API routes
  if (pathName.startsWith("/api/buyers") && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Redirect away from login if already authenticated
  if (pathName === "/login" && user) {
    return NextResponse.redirect(`${request.nextUrl.origin}/buyers`);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}