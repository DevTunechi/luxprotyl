'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import type { Lease } from '@/hooks/use-leases'

export default function LeasesPage() {
  const [leases, setLeases]   = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('leases')
        .select('*, properties(name, address)')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false })
      setLeases(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const statusColor = (s: string) => s === 'active' ? '#2EAE78' : s === 'expired' ? '#E8706A' : s === 'terminated' ? '#C0392B' : 'var(--gold)'
  const statusBg    = (s: string) => s === 'active' ? 'rgba(46,174,120,0.12)' : s === 'expired' ? 'rgba(232,112,106,0.12)' : s === 'terminated' ? 'rgba(192,57,43,0.12)' : 'rgba(201,148,58,0.12)'

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64, background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,48px)' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Tenancy</p>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Leases</h1>
          </div>
          <Link href="/leases/new">
            <button className="btn-gold" style={{ fontSize: 13, padding: '11px 24px' }}>+ New Lease</button>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 80, borderRadius: 12 }} />)}
          </div>
        ) : leases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📋</div>
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>No leases yet</h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28 }}>Create a lease for a property to start tracking tenancy.</p>
            <Link href="/leases/new"><button className="btn-gold" style={{ fontSize: 14, padding: '13px 32px' }}>Create First Lease</button></Link>
          </div>
        ) : (
          <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--divider)' }}>
                  {['Property', 'Tenant', 'Start Date', 'End Date', 'Monthly Rent', 'Status', ''].map((h, i) => (
                    <th key={i} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leases.map((l, i) => {
                  const now      = new Date()
                  const end      = new Date(l.end_date)
                  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                  const p        = l.properties as unknown as { name: string; address: string } | null
                  return (
                    <tr key={l.id} style={{ borderBottom: i < leases.length - 1 ? '1px solid var(--divider)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(201,148,58,0.03)'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{p?.name || '—'}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>{l.tenant_name || 'Pending'}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{new Date(l.start_date).toLocaleDateString('en-NG')}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: 13, color: daysLeft <= 30 && l.status === 'active' ? '#E8706A' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{new Date(l.end_date).toLocaleDateString('en-NG')}</span>
                        {l.status === 'active' && daysLeft <= 90 && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: daysLeft <= 30 ? '#E8706A' : '#D4A017' }}>({daysLeft}d left)</span>}
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gold)' }}>₦{l.monthly_rent.toLocaleString()}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: statusBg(l.status), color: statusColor(l.status) }}>{l.status}</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <Link href={`/leases/${l.id}`} style={{ fontSize: 12, color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>View →</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
