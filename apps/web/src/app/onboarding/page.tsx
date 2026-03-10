'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const STEPS = ['Welcome', 'Property Details', 'Invite Tenant']

const NIGERIA_STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [property, setProperty] = useState({
    name: '', address: '', state: 'Lagos', type: 'long_term' as 'long_term' | 'short_stay',
    bedrooms: 1, bathrooms: 1, monthly_rent: '', nightly_rate: '',
  })
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [propertyId, setPropertyId]   = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  function updateProp(k: keyof typeof property, v: string | number) {
    setProperty(p => ({ ...p, [k]: v }))
  }

  async function createProperty() {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const token = crypto.randomUUID()

      const { data, error } = await supabase
        .from('properties')
        .insert({
          landlord_id: user.id,
          name: property.name,
          address: property.address,
          state: property.state,
          type: property.type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          monthly_rent: property.type === 'long_term' ? Number(property.monthly_rent) : null,
          nightly_rate: property.type === 'short_stay' ? Number(property.nightly_rate) : null,
          status: 'vacant',
          invite_token: token,
        })
        .select()
        .single()

      if (error) throw error
      setInviteToken(token)
      setPropertyId(data.id)
      setStep(2)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  const inviteUrl = inviteToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${inviteToken}`
    : ''

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64, background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 60% 60% at 80% 20%, rgba(92,26,40,0.2) 0%, transparent 60%)` }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 540 }}>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, transition: 'all 0.3s', background: i < step ? 'var(--gold)' : i === step ? 'linear-gradient(135deg, var(--gold), #8A5E18)' : 'rgba(255,255,255,0.06)', color: i <= step ? 'var(--text-inverse)' : 'var(--text-muted)', border: i === step ? 'none' : '1px solid var(--divider-gold)' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 10, color: i === step ? 'var(--gold)' : 'var(--text-muted)', fontWeight: i === step ? 700 : 400, whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 60, height: 1, margin: '0 8px', marginBottom: 20, background: i < step ? 'var(--gold)' : 'var(--divider-gold)', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 22, padding: 'clamp(28px,5vw,44px)', boxShadow: 'var(--shadow-lg)' }}>

          {/* Step 0 — Welcome */}
          {step === 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🏡</div>
              <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(24px,3vw,32px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 14 }}>Welcome to LuxProptyl</h1>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32, maxWidth: 380, margin: '0 auto 32px' }}>
                Let&apos;s get your first property set up. It takes less than 2 minutes. You&apos;ll get a shareable invite link to send to your tenant.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {['Create your first property listing', 'Generate a unique tenant invite link', 'Collect rent and manage leases digitally'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(201,148,58,0.06)', border: '1px solid rgba(201,148,58,0.12)' }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-inverse)', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <button className="btn-gold" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={() => setStep(1)}>
                Let&apos;s set up your property →
              </button>
            </div>
          )}

          {/* Step 1 — Property Details */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>Property Details</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Tell us about your property</p>

              {error && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: 'var(--danger-bg)', border: '1px solid rgba(192,57,43,0.3)', fontSize: 13, color: '#E8706A' }}>{error}</div>}

              {/* Type toggle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: 5, borderRadius: 12, marginBottom: 22, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                {[{ v: 'long_term', l: '🏠 Long-term', s: 'Monthly rent' }, { v: 'short_stay', l: '🏨 Short-stay', s: 'Nightly rate' }].map(t => (
                  <button key={t.v} type="button" onClick={() => updateProp('type', t.v)} style={{ padding: '10px 8px', borderRadius: 9, border: 'none', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', background: property.type === t.v ? 'linear-gradient(135deg, var(--gold), #8A5E18)' : 'transparent', color: property.type === t.v ? 'var(--text-inverse)' : 'var(--text-muted)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{t.l}</div>
                    <div style={{ fontSize: 11, opacity: 0.8 }}>{t.s}</div>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Property Name</label>
                  <input type="text" placeholder="e.g. Lekki Phase 1 Apartment" value={property.name} onChange={e => updateProp('name', e.target.value)} className="lux-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Full Address</label>
                  <input type="text" placeholder="12 Admiralty Way, Lekki Phase 1" value={property.address} onChange={e => updateProp('address', e.target.value)} className="lux-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>State</label>
                  <select value={property.state} onChange={e => updateProp('state', e.target.value)} className="lux-input" style={{ cursor: 'pointer' }}>
                    {NIGERIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Bedrooms</label>
                    <input type="number" min={1} max={20} value={property.bedrooms} onChange={e => updateProp('bedrooms', Number(e.target.value))} className="lux-input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Bathrooms</label>
                    <input type="number" min={1} max={20} value={property.bathrooms} onChange={e => updateProp('bathrooms', Number(e.target.value))} className="lux-input" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                    {property.type === 'long_term' ? 'Monthly Rent (₦)' : 'Nightly Rate (₦)'}
                  </label>
                  <input type="number" placeholder={property.type === 'long_term' ? '650000' : '45000'} value={property.type === 'long_term' ? property.monthly_rent : property.nightly_rate} onChange={e => updateProp(property.type === 'long_term' ? 'monthly_rent' : 'nightly_rate', e.target.value)} className="lux-input" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button className="btn-ghost" style={{ flex: 1, padding: 13 }} onClick={() => setStep(0)}>← Back</button>
                <button className="btn-gold" style={{ flex: 2, padding: 13 }} disabled={loading || !property.name || !property.address} onClick={createProperty}>
                  {loading ? 'Creating…' : 'Create Property →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Invite Link */}
          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔗</div>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
                Property Created!
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
                Share this link with your tenant to onboard them. The link stays active for the life of the lease and auto-expires when the lease ends.
              </p>

              {/* Invite link box */}
              <div style={{ background: 'rgba(201,148,58,0.08)', border: '1px solid rgba(201,148,58,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all', textAlign: 'left', fontFamily: 'var(--font-mono)' }}>{inviteUrl}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(inviteUrl) }}
                  style={{ flexShrink: 0, background: 'var(--gold)', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: 'var(--text-inverse)', cursor: 'pointer' }}
                >
                  Copy
                </button>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8, marginBottom: 28, flexWrap: 'wrap' }}>
                <a href={`https://wa.me/?text=${encodeURIComponent('You have been invited to join LuxProptyl. Click to accept your tenancy: ' + inviteUrl)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 120, padding: '10px 16px', borderRadius: 8, background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  📱 WhatsApp
                </a>
                <a href={`mailto:?subject=Your LuxProptyl Tenant Invite&body=You have been invited to join LuxProptyl. Click to accept your tenancy: ${inviteUrl}`} style={{ flex: 1, minWidth: 120, padding: '10px 16px', borderRadius: 8, background: 'rgba(201,148,58,0.08)', border: '1px solid rgba(201,148,58,0.2)', color: 'var(--gold)', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  📧 Email
                </a>
              </div>

              <button className="btn-gold" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={() => router.push('/dashboard')}>
                Go to Dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
