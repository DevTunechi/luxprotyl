#!/bin/bash
cd ~/Desktop/luxprotyl || { echo "❌ Wrong directory"; exit 1; }

# Page wrapper with Suspense
cat > apps/web/src/app/auth/login/page.tsx << 'TSX'
import { Suspense } from 'react'
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
TSX

# Move all the actual logic to login-form.tsx
cat > apps/web/src/app/auth/login/login-form.tsx << 'TSX'
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'

export default function LoginForm() {
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
      const { data: profile } = await supabase
        .from('users').select('role').eq('id', data.user.id).maybeSingle()

      if (profile?.role === 'landlord') {
        const { count } = await supabase
          .from('properties').select('*', { count: 'exact', head: true }).eq('landlord_id', data.user.id)
        if ((count ?? 0) === 0) { window.location.href = '/onboarding'; return }
      }

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
              <input id="email" name="email" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="lux-input" />
            </div>
            <div style={{ marginBottom:10 }}>
              <label htmlFor="password" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Password</label>
              <input id="password" name="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" className="lux-input" />
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
              <button type="submit" className="btn-gold" style={{ width:'100%', padding:14, fontSize:15 }}>Sign In</button>
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
TSX

# Same fix needed for register page
cat > apps/web/src/app/auth/register/page.tsx << 'TSX'
import { Suspense } from 'react'
import RegisterForm from './register-form'

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
TSX

cat > apps/web/src/app/auth/register/register-form.tsx << 'TSX'
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'

type Role = 'landlord' | 'tenant'

export default function RegisterForm() {
  const router = useRouter()
  const [role, setRole]       = useState<Role>('landlord')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [form, setForm]       = useState({ firstName:'', lastName:'', email:'', phone:'', password:'' })

  function update(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowser()
    if (!supabase) { setError('Unable to connect. Please refresh.'); setLoading(false); return }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { first_name: form.firstName, last_name: form.lastName, phone: form.phone, role },
      },
    })

    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    if (data.user) {
      await supabase.from('users').upsert({
        id: data.user.id, email: form.email,
        first_name: form.firstName, last_name: form.lastName,
        phone: form.phone, role,
      })
    }

    router.push('/auth/verify?email=' + encodeURIComponent(form.email))
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'80px clamp(16px,5vw,40px) 40px', background:'var(--bg-base)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:`radial-gradient(ellipse 55% 45% at 20% 10%, rgba(201,148,58,0.07) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 80% 90%, rgba(92,26,40,0.2) 0%, transparent 55%)` }} />

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:480 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:52, height:52, borderRadius:14, marginBottom:14, background:'linear-gradient(135deg, var(--gold), #8A5E18)', boxShadow:'0 8px 24px rgba(201,148,58,0.3)' }}>
            <span style={{ fontSize:22 }}>✦</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-playfair), serif', fontSize:'clamp(24px,4vw,34px)', fontWeight:900, color:'var(--text-primary)', marginBottom:8 }}>
            Join <em style={{ fontStyle:'italic', color:'var(--gold)' }}>LuxProptyl</em>
          </h1>
          <p style={{ fontSize:14, color:'var(--text-muted)' }}>Nigeria&apos;s premium property management platform</p>
        </div>

        <div style={{ background:'var(--card-bg)', border:'1px solid var(--card-border)', borderRadius:20, padding:'clamp(24px,5vw,40px)', boxShadow:'var(--shadow-lg)', backdropFilter:'blur(16px)' }}>
          {error && <div style={{ padding:'12px 16px', borderRadius:10, marginBottom:18, background:'var(--danger-bg)', border:'1px solid rgba(192,57,43,0.3)', fontSize:13, color:'#E8706A' }}>⚠️ &nbsp;{error}</div>}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, padding:5, borderRadius:12, marginBottom:24, background:'rgba(255,255,255,0.03)', border:'1px solid var(--glass-border)' }}>
            {([{ value:'landlord', label:'🏠  Landlord', sub:'I own property' }, { value:'tenant', label:'🧑‍💼  Tenant', sub:'I rent property' }] as { value:Role; label:string; sub:string }[]).map(r => (
              <button key={r.value} type="button" onClick={() => setRole(r.value)} style={{ padding:'12px 8px', borderRadius:9, border:'none', cursor:'pointer', textAlign:'center', transition:'all 0.2s', background:role===r.value?'linear-gradient(135deg, var(--gold), #8A5E18)':'transparent', color:role===r.value?'var(--text-inverse)':'var(--text-muted)' }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{r.label}</div>
                <div style={{ fontSize:11, marginTop:2, opacity:0.8 }}>{r.sub}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
              <div>
                <label htmlFor="firstName" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>First Name</label>
                <input id="firstName" name="firstName" type="text" placeholder="Chukwuemeka" value={form.firstName} onChange={e => update('firstName', e.target.value)} required autoComplete="given-name" className="lux-input" />
              </div>
              <div>
                <label htmlFor="lastName" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Last Name</label>
                <input id="lastName" name="lastName" type="text" placeholder="Johnson" value={form.lastName} onChange={e => update('lastName', e.target.value)} required autoComplete="family-name" className="lux-input" />
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label htmlFor="reg-email" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Email Address</label>
              <input id="reg-email" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={e => update('email', e.target.value)} required autoComplete="email" className="lux-input" />
            </div>
            <div style={{ marginBottom:16 }}>
              <label htmlFor="phone" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Phone Number</label>
              <input id="phone" name="phone" type="tel" placeholder="+234 801 234 5678" value={form.phone} onChange={e => update('phone', e.target.value)} required autoComplete="tel" className="lux-input" />
            </div>
            <div style={{ marginBottom:24 }}>
              <label htmlFor="reg-password" style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Password</label>
              <input id="reg-password" name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => update('password', e.target.value)} required minLength={8} autoComplete="new-password" className="lux-input" />
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'12px 14px', borderRadius:10, marginBottom:22, background:'rgba(201,148,58,0.08)', border:'1px solid rgba(201,148,58,0.2)' }}>
              <span style={{ fontSize:16, flexShrink:0 }}>📧</span>
              <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.5, margin:0 }}>A verification link will be sent to your inbox. <strong style={{ color:'var(--gold)' }}>You must verify your email to activate your account.</strong></p>
            </div>
            <button type="submit" disabled={loading} className="btn-gold" style={{ width:'100%', padding:14, fontSize:15, opacity:loading?0.7:1 }}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:14, color:'var(--text-muted)', marginTop:20 }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color:'var(--gold)', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
          </p>
        </div>
        <p style={{ textAlign:'center', fontSize:11, color:'var(--text-muted)', marginTop:20 }}>🔒 Secured by Supabase Auth · NDPR Compliant</p>
      </div>
    </div>
  )
}
TSX

echo "✅ login — Suspense wrapper + form component"
echo "✅ register — Suspense wrapper + form component"
echo ""
echo "git add -A && git commit -m 'fix: wrap useSearchParams in Suspense for login + register' && git push"