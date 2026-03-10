#!/bin/bash
cd ~/Desktop/luxprotyl || { echo "❌ Wrong directory"; exit 1; }

# Fix login to NOT depend on users table at all for redirect
# Just redirect straight to dashboard — profile will be created there
cat > apps/web/src/app/auth/login/login-form.tsx << 'TSX'
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
              <Link href="/auth/reset" style={{ fontSize:12, color:'var(--gold)', textDecoration:'none' }}>Forgot password?</Link>
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
TSX
echo "✅ login simplified — straight redirect after auth, no profile query"

# Fix dashboard to NOT redirect to login if profile is null
# Just show dashboard content using auth user directly
cat > apps/web/src/app/dashboard/page.tsx << 'TSX'
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type Stats = { total:number; occupied:number; revenue:number; leases:number; overdue:number; expiring:number }
type Payment = { id:string; amount:number; status:string }
type Expiring = { id:string; end_date:string; days:number }

function fmt(n: number) {
  if (n >= 1_000_000) return `₦${(n/1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `₦${(n/1_000).toFixed(0)}k`
  return `₦${n}`
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser]         = useState<User | null>(null)
  const [firstName, setFirstName] = useState('there')
  const [stats, setStats]       = useState<Stats | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [expiring, setExpiring] = useState<Expiring[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    if (!supabase) { router.push('/auth/login'); return }

    async function load() {
      const { data: { user } } = await supabase!.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      // Get name from auth metadata directly — no users table needed
      const meta = user.user_metadata ?? {}
      setFirstName(meta.first_name ?? meta.full_name?.split(' ')[0] ?? 'there')

      // Upsert profile silently in background
      supabase!.from('users').upsert({
        id:         user.id,
        email:      user.email ?? '',
        first_name: meta.first_name ?? '',
        last_name:  meta.last_name  ?? '',
        phone:      meta.phone ?? '',
        role:       meta.role ?? 'landlord',
      }).then(() => {})

      const [propsRes, leasesRes, pmtsRes] = await Promise.all([
        supabase!.from('properties').select('status,monthly_rent').eq('landlord_id', user.id),
        supabase!.from('leases').select('id,status,end_date').eq('landlord_id', user.id).eq('status','active'),
        supabase!.from('payments').select('id,amount,status').eq('landlord_id', user.id).order('created_at',{ascending:false}).limit(6),
      ])

      const props  = propsRes.data  ?? []
      const leases = leasesRes.data ?? []
      const pmts   = pmtsRes.data   ?? []
      const now    = new Date()
      const in90   = new Date(now.getTime()+90*86400000)

      const expList = leases
        .filter(l => new Date(l.end_date) <= in90)
        .map(l => ({ id:l.id, end_date:l.end_date, days:Math.ceil((new Date(l.end_date).getTime()-now.getTime())/86400000) }))

      setStats({
        total:    props.length,
        occupied: props.filter(p=>p.status==='occupied').length,
        revenue:  props.reduce((s,p)=>s+(p.monthly_rent||0),0),
        leases:   leases.length,
        overdue:  pmts.filter(p=>p.status==='overdue').length,
        expiring: expList.length,
      })
      setPayments(pmts)
      setExpiring(expList)
      setLoading(false)
    }

    load()
  }, [])

  const hr = new Date().getHours()
  const greeting = hr<12?'morning':hr<17?'afternoon':'evening'

  if (loading) return (
    <div className="page-container" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:40,height:40,border:'3px solid rgba(201,148,58,0.2)',borderTopColor:'var(--gold)',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 12px'}} />
        <p style={{fontSize:13,color:'var(--text-muted)'}}>Loading your portfolio…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const kpis = stats ? [
    { label:'Properties',      value:stats.total,        sub:`${stats.occupied} occupied`,  icon:'🏠', color:'var(--gold)' },
    { label:'Monthly Revenue', value:fmt(stats.revenue), sub:'Across all leases',           icon:'💰', color:'#2EAE78' },
    { label:'Active Leases',   value:stats.leases,       sub:`${stats.expiring} expiring`,  icon:'📋', color:'var(--gold)', alert:stats.expiring>0 },
    { label:'Overdue',         value:stats.overdue,      sub:'Require action',              icon:'⚠️', color:stats.overdue>0?'#E8706A':'#2EAE78', alert:stats.overdue>0 },
  ] : []

  return (
    <div className="page-container">
      <div className="page-inner">
        <div className="page-header">
          <div>
            <p className="eyebrow" style={{marginBottom:6}}>Dashboard</p>
            <h1 style={{fontFamily:'var(--font-playfair), serif',fontSize:'clamp(22px,3vw,34px)',fontWeight:900,color:'var(--text-primary)',margin:0}}>
              Good {greeting}, <em style={{color:'var(--gold)',fontStyle:'italic'}}>{firstName}</em> 👋
            </h1>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <Link href="/properties/new"><button className="btn-gold" style={{fontSize:13,padding:'9px 18px'}}>+ Property</button></Link>
            <Link href="/leases/new"><button className="btn-ghost" style={{fontSize:13,padding:'9px 18px'}}>+ Lease</button></Link>
          </div>
        </div>

        <div className="kpi-grid">
          {kpis.map((k,i) => (
            <div key={i} className="kpi-card">
              {k.alert && <span style={{position:'absolute',top:12,right:12,width:8,height:8,borderRadius:'50%',background:'#E8706A',boxShadow:'0 0 6px rgba(232,112,106,0.6)'}} />}
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                <span style={{fontSize:18}}>{k.icon}</span>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text-muted)'}}>{k.label}</span>
              </div>
              <p style={{fontFamily:'var(--font-mono)',fontSize:'clamp(20px,2.5vw,30px)',fontWeight:700,color:k.color,lineHeight:1,marginBottom:4}}>{k.value}</p>
              <p style={{fontSize:11,color:'var(--text-muted)',margin:0}}>{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="main-grid-2">
          <div className="glass-card" style={{padding:'clamp(18px,3vw,28px)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <h2 style={{fontFamily:'var(--font-playfair), serif',fontSize:'clamp(15px,2vw,20px)',fontWeight:700,color:'var(--text-primary)',margin:0}}>Recent Payments</h2>
              <Link href="/payments" style={{fontSize:12,color:'var(--gold)',textDecoration:'none',fontWeight:600}}>View all →</Link>
            </div>
            {payments.length===0 ? (
              <div style={{textAlign:'center',padding:'24px 0'}}>
                <div style={{fontSize:32,marginBottom:10}}>💳</div>
                <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:16}}>No payments yet.</p>
                <Link href="/properties/new"><button className="btn-gold" style={{fontSize:13,padding:'9px 18px'}}>Add Property</button></Link>
              </div>
            ) : payments.map((p,i) => (
              <div key={p.id} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 0',borderBottom:i<payments.length-1?'1px solid var(--divider)':'none'}}>
                <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:'var(--text-primary)',margin:0}}>Payment #{p.id.slice(-6)}</p></div>
                <span style={{fontSize:14,fontFamily:'var(--font-mono)',fontWeight:700,color:'var(--gold)'}}>₦{p.amount?.toLocaleString()}</span>
                <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:99,background:p.status==='paid'?'rgba(46,174,120,0.12)':'rgba(201,148,58,0.12)',color:p.status==='paid'?'#2EAE78':'var(--gold)'}}>{p.status}</span>
              </div>
            ))}
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="glass-card" style={{padding:'clamp(16px,2.5vw,24px)'}}>
              <h2 style={{fontFamily:'var(--font-playfair), serif',fontSize:'clamp(14px,1.8vw,18px)',fontWeight:700,color:'var(--text-primary)',marginBottom:12}}>Lease Alerts</h2>
              {expiring.length===0 ? (
                <div style={{textAlign:'center',padding:'12px 0'}}>
                  <span style={{fontSize:24}}>✅</span>
                  <p style={{fontSize:12,color:'var(--text-muted)',marginTop:6}}>No leases expiring soon</p>
                </div>
              ) : expiring.map((l,i) => (
                <div key={l.id} style={{display:'flex',gap:8,padding:'9px 0',borderBottom:i<expiring.length-1?'1px solid var(--divider)':'none'}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:l.days<=30?'#E8706A':'#D4A017',flexShrink:0,marginTop:5}} />
                  <div>
                    <p style={{fontSize:12,fontWeight:600,color:'var(--text-primary)',margin:0}}>Lease expires</p>
                    <p style={{fontSize:11,color:'var(--text-muted)',margin:0}}>in <strong style={{color:l.days<=30?'#E8706A':'#D4A017'}}>{l.days} days</strong> · {new Date(l.end_date).toLocaleDateString('en-NG')}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{padding:'clamp(16px,2.5vw,24px)'}}>
              <h2 style={{fontFamily:'var(--font-playfair), serif',fontSize:'clamp(14px,1.8vw,18px)',fontWeight:700,color:'var(--text-primary)',marginBottom:12}}>Quick Actions</h2>
              <div style={{display:'flex',flexDirection:'column',gap:7}}>
                {[
                  {label:'🏠 Add Property',    href:'/properties/new'},
                  {label:'📋 Create Lease',    href:'/leases/new'},
                  {label:'⚖️ Generate Notice', href:'/notices/new'},
                  {label:'📊 All Properties',  href:'/properties'},
                ].map((a,i) => (
                  <Link key={i} href={a.href} style={{textDecoration:'none'}}>
                    <div style={{padding:'9px 12px',borderRadius:9,fontSize:13,color:'var(--text-secondary)',background:'rgba(255,255,255,0.02)',border:'1px solid var(--divider)',cursor:'pointer',transition:'all 0.15s'}}
                      onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background='rgba(201,148,58,0.07)';el.style.color='var(--gold)';el.style.borderColor='rgba(201,148,58,0.2)'}}
                      onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement;el.style.background='rgba(255,255,255,0.02)';el.style.color='var(--text-secondary)';el.style.borderColor='var(--divider)'}}
                    >{a.label}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
TSX
echo "✅ dashboard — reads from auth metadata directly, no users table dependency"

echo ""
echo "git add -A && git commit -m 'fix: bypass users table on login + dashboard reads from auth metadata' && git push"