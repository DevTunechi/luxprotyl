'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function NewLeasePage() {
  const router = useRouter()
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [properties, setProperties] = useState<{ id: string; name: string; monthly_rent: number }[]>([])
  const [form, setForm] = useState({
    property_id: '', start_date: '', end_date: '',
    monthly_rent: '', security_deposit: '', notes: '',
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadProps() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('properties').select('id, name, monthly_rent').eq('landlord_id', user.id).eq('status', 'occupied')
      setProperties(data ?? [])
    }
    loadProps()
  }, [])

  function update(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase.from('leases').insert({
        landlord_id: user.id,
        property_id: form.property_id,
        start_date: form.start_date,
        end_date: form.end_date,
        monthly_rent: Number(form.monthly_rent),
        security_deposit: form.security_deposit ? Number(form.security_deposit) : null,
        notes: form.notes || null,
        status: 'active',
      }).select().single()

      if (error) throw error
      router.push(`/leases/${data.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create lease')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64, background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,32px)' }}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/leases" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>← Back to Leases</Link>
          <p className="eyebrow" style={{ marginBottom: 8 }}>New Lease</p>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Create Lease Agreement</h1>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 22, padding: 'clamp(24px,4vw,40px)', boxShadow: 'var(--shadow-lg)' }}>
          {error && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'var(--danger-bg)', border: '1px solid rgba(192,57,43,0.3)', fontSize: 13, color: '#E8706A' }}>{error}</div>}

          {properties.length === 0 && (
            <div style={{ padding: '14px 16px', borderRadius: 10, marginBottom: 20, background: 'rgba(201,148,58,0.08)', border: '1px solid rgba(201,148,58,0.2)', fontSize: 13, color: 'var(--gold)' }}>
              ℹ️ &nbsp;Leases can only be created for occupied properties. <Link href="/properties" style={{ color: 'var(--gold)', fontWeight: 700 }}>View properties →</Link>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Property *</label>
              <select value={form.property_id} onChange={e => { update('property_id', e.target.value); const p = properties.find(p => p.id === e.target.value); if (p) update('monthly_rent', String(p.monthly_rent)) }} required className="lux-input" style={{ cursor: 'pointer' }}>
                <option value="">Select a property…</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Start Date *</label>
                <input type="date" value={form.start_date} onChange={e => update('start_date', e.target.value)} required className="lux-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>End Date *</label>
                <input type="date" value={form.end_date} onChange={e => update('end_date', e.target.value)} required className="lux-input" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Monthly Rent (₦) *</label>
                <input type="number" placeholder="650000" value={form.monthly_rent} onChange={e => update('monthly_rent', e.target.value)} required className="lux-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Security Deposit (₦)</label>
                <input type="number" placeholder="1300000" value={form.security_deposit} onChange={e => update('security_deposit', e.target.value)} className="lux-input" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Notes</label>
              <textarea placeholder="Additional terms, conditions, or notes…" value={form.notes} onChange={e => update('notes', e.target.value)} className="lux-input" style={{ minHeight: 90, resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={loading || !form.property_id || !form.start_date || !form.end_date || !form.monthly_rent} className="btn-gold" style={{ padding: 14, fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating lease…' : 'Create Lease Agreement →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
