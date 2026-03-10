'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

type PropertyInfo = { name: string; address: string; state: string; landlord_name: string; monthly_rent: number; type: string }

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token  = params.token as string

  const [property, setProperty] = useState<PropertyInfo | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadInvite() {
      const { data, error } = await supabase
        .from('properties')
        .select('name, address, state, monthly_rent, type, users!landlord_id(first_name, last_name)')
        .eq('invite_token', token)
        .eq('status', 'vacant')
        .single()

      if (error || !data) { setError('This invite link is invalid or has already been used.'); setLoading(false); return }

      const u = data.users as unknown as { first_name: string; last_name: string } | null
      setProperty({
        name: data.name,
        address: data.address,
        state: data.state,
        type: data.type,
        monthly_rent: data.monthly_rent,
        landlord_name: u ? `${u.first_name} ${u.last_name}` : 'Your Landlord',
      })
      setLoading(false)
    }
    loadInvite()
  }, [token])

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Sign up tenant
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { first_name: form.firstName, last_name: form.lastName, phone: form.phone, role: 'tenant' },
        },
      })
      if (signUpError) throw signUpError

      if (data.user) {
        // Create user profile
        await supabase.from('users').upsert({
          id: data.user.id, email: form.email,
          first_name: form.firstName, last_name: form.lastName,
          phone: form.phone, role: 'tenant',
        })

        // Mark property as occupied, attach tenant
        await supabase.from('properties')
          .update({ status: 'occupied', tenant_id: data.user.id })
          .eq('invite_token', token)
      }

      router.push('/auth/verify?email=' + encodeURIComponent(form.email))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to accept invite')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(201,148,58,0.2)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error && !property) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--bg-base)' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🔗</div>
        <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Invalid Invite</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{error}</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 55% 50% at 30% 20%, rgba(201,148,58,0.07) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 70% 80%, rgba(92,26,40,0.2) 0%, transparent 55%)` }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 500 }}>

        {/* Property card */}
        {property && (
          <div style={{ background: 'rgba(201,148,58,0.06)', border: '1px solid rgba(201,148,58,0.2)', borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>You&apos;ve been invited to</p>
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>{property.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{property.address}, {property.state}</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>👤 Landlord: <strong style={{ color: 'var(--text-primary)' }}>{property.landlord_name}</strong></span>
              {property.monthly_rent && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>💰 Rent: <strong style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>₦{property.monthly_rent.toLocaleString()}/mo</strong></span>}
            </div>
          </div>
        )}

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 'clamp(28px,5vw,40px)', boxShadow: 'var(--shadow-lg)' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(22px,3vw,28px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>Accept Tenancy</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Create your tenant account to get started</p>

          {error && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'var(--danger-bg)', border: '1px solid rgba(192,57,43,0.3)', fontSize: 13, color: '#E8706A' }}>{error}</div>}

          <form onSubmit={handleAccept}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>First Name</label>
                <input type="text" placeholder="Amaka" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required className="lux-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Last Name</label>
                <input type="text" placeholder="Obi" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required className="lux-input" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Email</label>
              <input type="email" placeholder="amaka@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="lux-input" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Phone</label>
              <input type="tel" placeholder="+234 801 234 5678" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required className="lux-input" />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Create Password</label>
              <input type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} className="lux-input" />
            </div>
            <button type="submit" disabled={submitting} className="btn-gold" style={{ width: '100%', padding: 14, fontSize: 15, opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Creating account…' : 'Accept & Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
