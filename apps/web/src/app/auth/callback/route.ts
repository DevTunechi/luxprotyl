import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code       = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type')
  const next       = searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  // Flow 1: PKCE code exchange (magic link / OAuth)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      return await redirectAfterAuth(supabase, data.user.id, origin, next)
    }
  }

  // Flow 2: token_hash (email OTP verification)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'signup' | 'recovery' | 'email_change',
    })
    if (!error && data.user) {
      return await redirectAfterAuth(supabase, data.user.id, origin, next)
    }
  }

  // Failed — send back to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`)
}

async function redirectAfterAuth(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createClient>>,
  userId: string,
  origin: string,
  next: string
) {
  // Ensure user profile exists
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  // First-time landlord → onboarding
  if (profile?.role === 'landlord') {
    const { count } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('landlord_id', userId)

    if ((count ?? 0) === 0) {
      return NextResponse.redirect(`${origin}/onboarding`)
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
