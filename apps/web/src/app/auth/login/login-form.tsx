'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const next         = searchParams.get('next') || '/dashboard'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowser()
    if (!supabase) {
      setError('Unable to connect. Please refresh.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email first. Check your inbox.')
      } else if (error.message.includes('Invalid login') || error.message.includes('invalid_credentials')) {
        setError('Incorrect email or password.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      // Skip profile check — go straight to dashboard
      // Dashboard will handle onboarding redirect if needed
      window.location.href = next
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'80px clamp(16px,5vw,40px) 40px', background:'var(--bg-base)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:`radial-gradient(ellipse 60% 50% at 50% 0%, rgba(92,26,40,0.25) 0%, transparent 60%)` }} />

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
            <div style={{ padding:'12px 16px', borderRadius:10, marginBottom:20, background:'rgba(192,57,43,0.1)', border:'1px solid rgba(192,57,43,0.3)', fontSize:13, color:'#E8706A', lineHeight:1.5 }}>
              ⚠️ &nbsp;{error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom:18 }}>
              <label htmlFor="email" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Email Address</label>
              <input id="email" name="email" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="lux-input" />
            </div>
            <div style={{ marginBottom:10 }}>
              <label htmlFor="password" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Password</label>
              <input id="password" name="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" className="lux-input" />
            </div>
            <div style={{ textAlign:'right', marginBottom:22 }}>
              <Link href="#" style={{ fontSize:12, color:'var(--gold)', textDecoration:'none' }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-gold" style={{ width:'100%', padding:14, fontSize:15, opacity:loading?0.7:1 }}>
              {loading ? (
                <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
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
