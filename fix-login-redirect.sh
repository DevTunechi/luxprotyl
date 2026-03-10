#!/bin/bash
cd ~/Desktop/luxprotyl || { echo "❌ Wrong directory"; exit 1; }
if [ ! -d "apps/web" ]; then echo "❌ Run from repo root"; exit 1; fi

WEB="apps/web/src"

cat > $WEB/app/auth/login/page.tsx << 'EOF'
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const next         = searchParams.get('next') || '/dashboard'
  const urlError     = searchParams.get('error')

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(
    urlError === 'verification_failed' ? 'Email verification failed. Please try again.' : null
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowser()
    if (!supabase) { setError('Unable to connect. Please refresh.'); setLoading(false); return }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email first. Check your inbox for the confirmation link.')
      } else if (error.message.includes('Invalid login') || error.message.includes('invalid_credentials')) {
        setError('Incorrect email or password. Please try again.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      // Check if landlord needs onboarding
      const { data: profile } = await supabase
        .from('users').select('role').eq('id', data.user.id).maybeSingle()

      if (profile?.role === 'landlord') {
        const { count } = await supabase
          .from('properties').select('*', { count:'exact', head:true }).eq('landlord_id', data.user.id)
        if ((count ?? 0) === 0) {
          // Use window.location for hard redirect — ensures session cookie is set
          window.location.href = '/onboarding'
          return
        }
      }

      // Hard redirect — not router.push — so the new page loads with fresh session
      window.location.href = next
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'80px clamp(16px,5vw,40px) 40px', background:'var(--bg-base)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:`radial-gradient(ellipse 60% 50% at 50% 0%, rgba(92,26,40,0.25) 0%, transparent 60%)` }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.018, backgroundImage:`repeating-linear-gradient(45deg, rgba(201,148,58,1) 0px, rgba(201,148,58,1) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(-45deg, rgba(201,148,58,1) 0px, rgba(201,148,58,1) 1px, transparent 1px, transparent 28px)` }} />

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:52, height:52, borderRadius:14, marginBottom:14, background:'linear-gradient(135deg, var(--gold), #8A5E18)', boxShadow:'0 8px 24px rgba(201,148,58,0.3)' }}>
            <span style={{ fontSize:22 }}>🏠</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-playfair), serif', fontSize:'clamp(24px,4vw,34px)', fontWeight:900, color:'var(--text-primary)', marginBottom:8 }}>Welcome back</h1>
          <p style={{ fontSize:14, color:'var(--text-muted)' }}>Sign in to your LuxProptyl account</p>
        </div>

        <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:20, padding:'clamp(24px,5vw,40px)', boxShadow:'var(--shadow-lg)', backdropFilter:'blur(16px)' }}>
          {error && (
            <div style={{ padding:'12px 16px', borderRadius:10, marginBottom:20, background:'var(--danger-bg)', border:'1px solid rgba(192,57,43,0.3)', fontSize:13, color:'#E8706A', lineHeight:1.5 }}>
              ⚠️ &nbsp;{error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom:18 }}>
              <label htmlFor="email" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Email Address</label>
              <input
                id="email" name="email" type="email"
                placeholder="you@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email"
                className="lux-input"
              />
            </div>
            <div style={{ marginBottom:10 }}>
              <label htmlFor="password" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Password</label>
              <input
                id="password" name="password" type="password"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                className="lux-input"
              />
            </div>
            <div style={{ textAlign:'right', marginBottom:22 }}>
              <a href="#" style={{ fontSize:12, color:'var(--gold)', textDecoration:'none' }}>Forgot password?</a>
            </div>

            {loading ? (
              <div style={{ width:'100%', padding:14, borderRadius:12, background:'linear-gradient(135deg, var(--gold), #8A5E18)', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                <div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                <span style={{ fontSize:15, fontWeight:700, color:'white' }}>Signing in…</span>
              </div>
            ) : (
              <button type="submit" className="btn-gold" style={{ width:'100%', padding:14, fontSize:15 }}>
                Sign In
              </button>
            )}
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'22px 0' }}>
            <div style={{ flex:1, height:1, background:'var(--divider)' }} />
            <span style={{ fontSize:11, color:'var(--text-muted)', letterSpacing:'0.1em', textTransform:'uppercase' }}>or</span>
            <div style={{ flex:1, height:1, background:'var(--divider)' }} />
          </div>
          <p style={{ textAlign:'center', fontSize:14, color:'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" style={{ color:'var(--gold)', fontWeight:600, textDecoration:'none' }}>Get started free</Link>
          </p>
        </div>
        <p style={{ textAlign:'center', fontSize:11, color:'var(--text-muted)', marginTop:20 }}>🔒 Secured by Supabase Auth · NDPR Compliant</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
EOF

echo "✅ login/page.tsx — uses window.location.href for hard redirect"
echo ""
echo "git add -A && git commit -m 'fix: login redirect — window.location.href ensures session cookie is set' && git push"