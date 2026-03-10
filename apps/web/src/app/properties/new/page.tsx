'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

const NIGERIA_STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', address: '', state: 'Lagos',
    type: 'long_term' as 'long_term' | 'short_stay',
    bedrooms: 1, bathrooms: 1,
    monthly_rent: '', nightly_rate: '', description: '',
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function update(k: keyof typeof form, v: string | number) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase.from('properties').insert({
        landlord_id: user.id,
        name: form.name, address: form.address, state: form.state,
        type: form.type, bedrooms: form.bedrooms, bathrooms: form.bathrooms,
        monthly_rent: form.type === 'long_term' ? Number(form.monthly_rent) || null : null,
        nightly_rate: form.type === 'short_stay' ? Number(form.nightly_rate) || null : null,
        description: form.description || null,
        status: 'vacant',
        invite_token: crypto.randomUUID(),
      }).select().single()

      if (error) throw error
      router.push(`/properties/${data.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create property')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64, background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,32px)' }}>

        <div style={{ marginBottom: 32 }}>
          <Link href="/properties" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>← Back to Properties</Link>
          <p className="eyebrow" style={{ marginBottom: 8 }}>New Property</p>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Add a Property</h1>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 22, padding: 'clamp(24px,4vw,40px)', boxShadow: 'var(--shadow-lg)' }}>
          {error && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'var(--danger-bg)', border: '1px solid rgba(192,57,43,0.3)', fontSize: 13, color: '#E8706A' }}>{error}</div>}

          {/* Type */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Property Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: 5, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
              {[{ v: 'long_term', l: '🏠 Long-term Rental', s: 'Monthly rent' }, { v: 'short_stay', l: '🏨 Short-stay / Airbnb', s: 'Nightly rate' }].map(t => (
                <button key={t.v} type="button" onClick={() => update('type', t.v)} style={{ padding: '11px 8px', borderRadius: 9, border: 'none', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', background: form.type === t.v ? 'linear-gradient(135deg, var(--gold), #8A5E18)' : 'transparent', color: form.type === t.v ? 'var(--text-inverse)' : 'var(--text-muted)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{t.l}</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>{t.s}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Property Name *</label>
              <input type="text" placeholder="e.g. Lekki Phase 1 — 3 Bedroom Flat" value={form.name} onChange={e => update('name', e.target.value)} required className="lux-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Full Address *</label>
              <input type="text" placeholder="12 Admiralty Way, Lekki Phase 1, Lagos" value={form.address} onChange={e => update('address', e.target.value)} required className="lux-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>State *</label>
              <select value={form.state} onChange={e => update('state', e.target.value)} className="lux-input" style={{ cursor: 'pointer' }}>
                {NIGERIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Bedrooms</label>
                <input type="number" min={1} max={20} value={form.bedrooms} onChange={e => update('bedrooms', Number(e.target.value))} className="lux-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Bathrooms</label>
                <input type="number" min={1} max={20} value={form.bathrooms} onChange={e => update('bathrooms', Number(e.target.value))} className="lux-input" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                {form.type === 'long_term' ? 'Monthly Rent (₦)' : 'Nightly Rate (₦)'}
              </label>
              <input type="number" placeholder={form.type === 'long_term' ? '650000' : '45000'} value={form.type === 'long_term' ? form.monthly_rent : form.nightly_rate} onChange={e => update(form.type === 'long_term' ? 'monthly_rent' : 'nightly_rate', e.target.value)} className="lux-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Description (optional)</label>
              <textarea placeholder="Brief description of the property…" value={form.description} onChange={e => update('description', e.target.value)} className="lux-input" style={{ minHeight: 90, resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={loading || !form.name || !form.address} className="btn-gold" style={{ padding: 14, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating…' : 'Create Property →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
