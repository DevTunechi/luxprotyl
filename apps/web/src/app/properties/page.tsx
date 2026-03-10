'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import type { Property } from '@/hooks/use-properties'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading]       = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('properties').select('*').eq('landlord_id', user.id).order('created_at', { ascending: false })
      setProperties(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64, background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,48px)' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Portfolio</p>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>My Properties</h1>
          </div>
          <Link href="/properties/new">
            <button className="btn-gold" style={{ fontSize: 13, padding: '11px 24px' }}>+ Add Property</button>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 20 }}>
            {[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 200, borderRadius: 16 }} />)}
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🏠</div>
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>No properties yet</h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28 }}>Add your first property to start managing rent and tenants.</p>
            <Link href="/properties/new"><button className="btn-gold" style={{ fontSize: 14, padding: '13px 32px' }}>Add Your First Property</button></Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 20 }}>
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
      <style>{`@media(max-width:900px){.prop-grid{grid-template-columns:repeat(2,1fr)!important;}}@media(max-width:560px){.prop-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}

function PropertyCard({ property: p }: { property: Property }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="glass-card"
        style={{ padding: 24, cursor: 'pointer' }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>{p.type === 'short_stay' ? '🏨' : '🏠'}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: p.status === 'occupied' ? 'rgba(46,174,120,0.12)' : 'rgba(201,148,58,0.12)', color: p.status === 'occupied' ? '#2EAE78' : 'var(--gold)' }}>
            {p.status}
          </span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 17, fontWeight: 700, color: hov ? 'var(--gold)' : 'var(--text-primary)', marginBottom: 4, transition: 'color 0.2s' }}>{p.name}</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{p.address}, {p.state}</p>
        <div style={{ display: 'flex', gap: 16 }}>
          {p.monthly_rent && <div><p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Monthly Rent</p><p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--gold)', margin: 0 }}>₦{p.monthly_rent.toLocaleString()}</p></div>}
          {p.nightly_rate && <div><p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Nightly Rate</p><p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--gold)', margin: 0 }}>₦{p.nightly_rate.toLocaleString()}</p></div>}
          <div><p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Beds / Baths</p><p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>{p.bedrooms}bd · {p.bathrooms}ba</p></div>
        </div>
      </div>
    </Link>
  )
}
