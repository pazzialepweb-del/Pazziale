import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // ✅ AGREGAMOS await aquí para resolver la Promesa
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignoramos este error porque en Server Components a veces no se pueden establecer cookies
              // El usuario se mantiene logueado gracias al middleware
            }
          },
        },
      }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirigir a la tienda después del login
  return NextResponse.redirect(new URL('/tienda', requestUrl))
}