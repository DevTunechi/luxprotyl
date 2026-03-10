'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/hooks/use-user'
import { createBrowserClient } from '@supabase/ssr'

type PortfolioStats = {
  total_properties: number
  occupied_properties: number
  total_monthly_revenue: number
  active_leases: number
  overdue_payments: number
  expiring_soon: number
}

type RecentPayment = {
  id: string
  tenant_name: string
  property_name: string
  amount: number
  status: string
  due_date: string
}

type ExpiringLease = {
  id: string
  property_name: string
  tenant_name: string
  end_date: string
  days_until_expiry: number
}

function formatNaira(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}k`
  return `₦${n}`
}

export default function DashboardPage() {
  const { profile, loading: authLoading } = useUser()
  const router = useRouter()

  const [stats, setStats]     = useState<PortfolioStats | null>(null)
  const [payments, setPayments] = useState<RecentPayment[]>([])
  const [expiring, setExpiring] = useState<ExpiringLease[]>([])
  const [loading, setLoading]   = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (!authLoading && !profile) { router.push('/auth/login'); return }
    if (!profile) return

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Portfolio stats
      const [propsRes, leasesRes, paymentsRes] = await Promise.all([
        supabase.from('properties').select('status, monthly_rent').eq('landlord_id', user.id),
        supabase.from('leases').select('id, status, end_date').eq('landlord_id', user.id).eq('status', 'active'),
        supabase.from('payments').select('amount, status, due_date').eq('landlord_id', user.id).order('created_at', { ascending: false }).limit(10),
      ])

      const props    = propsRes.data ?? []
      const leases   = leasesRes.data ?? []
      const pmts     = paymentsRes.data ?? []
      const now      = new Date()
      const in90days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

      setStats({
        total_properties:      props.length,
        occupied_properties:   props.filter(p => p.status === 'occupied').length,
        total_monthly_revenue: props.reduce((s, p) => s + (p.monthly_rent || 0), 0),
        active_leases:         leases.length,
        overdue_payments:      pmts.filter(p => p.status === 'overdue').length,
        expiring_soon:         leases.filter(l => new Date(l.end_date) <= in90days).length,
      })

      setExpiring(
        leases
          .filter(l => new Date(l.end_date) <= in90days)
          .map(l => ({
            id: l.id,
            property_name: 'Property',
            tenant_name: 'Tenant',
            end_date: l.end_date,
            days_until_expiry: Math.ceil((new Date(l.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
          }))
      )

      setLoading(false)
    }

    load()
  }, [profile, authLoading])

  if (authLoading || loading) return (
    <div style={{ minHeight: '100vh', paddingTop: 64, background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, border: '3px solid rgba(201,148,58,0.2)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading your portfolio…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const kpis = stats ? [
    { label: 'Total Properties', value: stats.total_properties, sub: `${stats.occupied_properties} occupied`, icon: '🏠', color: 'var(--gold)' },
    { label: 'Monthly Revenue', value: formatNaira(stats.total_monthly_revenue), sub: 'Across all leases', icon: '💰', color: '#2EAE78' },
    { label: 'Active Leases', value: stats.active_leases, sub: `${stats.expiring_soon} expiring soon`, icon: '📋', color: 'var(--gold)', alert: stats.expiring_soon > 0 },
    { label: 'Overdue Payments', value: stats.overdue_payments, sub: 'Require action', icon: '⚠️', color: stats.overdue_payments > 0 ? '#E8706A' : '#2EAE78', alert: stats.overdue_payments > 0 },
  ] : []

  return (
    <div style={{ minHeight: '100vh', paddingTop: 64, background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,48px)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Dashboard</p>
            <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{profile?.first_name}</em> 👋
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/properties/new">
              <button className="btn-gold" style={{ fontSize: 13, padding: '10px 20px' }}>+ Add Property</button>
            </Link>
            <Link href="/leases/new">
              <button className="btn-ghost" style={{ fontSize: 13, padding: '10px 20px' }}>+ New Lease</button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 16, marginBottom: 36 }}>
          {kpis.map((k, i) => (
            <div key={i} className="kpi-card" style={{ position: 'relative' }}>
              {k.alert && <span style={{ position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: '50%', background: '#E8706A', boxShadow: '0 0 6px rgba(232,112,106,0.6)', animation: 'pulse-gold 2s infinite' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 20 }}>{k.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{k.label}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 700, color: k.color, lineHeight: 1, marginBottom: 6 }}>{k.value}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 20 }}>

          {/* Recent payments */}
          <div className="glass-card" style={{ padding: 'clamp(20px,3vw,28px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Recent Payments</h2>
              <Link href="/payments" style={{ fontSize: 12, color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>
            {payments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No payments yet. Add a property and invite your tenant to get started.</p>
                <Link href="/properties/new"><button className="btn-gold" style={{ marginTop: 16, fontSize: 13, padding: '10px 20px' }}>Add Property</button></Link>
              </div>
            ) : (
              <div>
                {payments.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < payments.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.tenant_name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{p.property_name}</p>
                    </div>
                    <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gold)' }}>₦{p.amount.toLocaleString()}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: p.status === 'paid' ? 'rgba(46,174,120,0.12)' : p.status === 'overdue' ? 'rgba(192,57,43,0.12)' : 'rgba(201,148,58,0.12)', color: p.status === 'paid' ? '#2EAE78' : p.status === 'overdue' ? '#E8706A' : 'var(--gold)' }}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring leases + quick actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Expiring */}
            <div className="glass-card" style={{ padding: 'clamp(18px,2.5vw,24px)', flex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Lease Alerts</h2>
              {expiring.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <span style={{ fontSize: 28 }}>✅</span>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>No leases expiring soon</p>
                </div>
              ) : expiring.map((l, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < expiring.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.days_until_expiry <= 30 ? '#E8706A' : '#D4A017', flexShrink: 0, marginTop: 6 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{l.property_name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Expires in <strong style={{ color: l.days_until_expiry <= 30 ? '#E8706A' : '#D4A017' }}>{l.days_until_expiry} days</strong></p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="glass-card" style={{ padding: 'clamp(18px,2.5vw,24px)' }}>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '🏠 Add New Property',    href: '/properties/new' },
                  { label: '📋 Create Lease',         href: '/leases/new' },
                  { label: '⚖️ Generate Notice',      href: '/notices/new' },
                  { label: '📊 View All Properties',  href: '/properties' },
                ].map((a, i) => (
                  <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--divider)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,148,58,0.07)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,148,58,0.2)'; (e.currentTarget as HTMLDivElement).style.color = 'var(--gold)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--divider)'; (e.currentTarget as HTMLDivElement).style.color = 'var(--text-secondary)' }}
                    >
                      {a.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-kpis  { grid-template-columns: repeat(2,1fr) !important; }
          .dashboard-main  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .dashboard-kpis  { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse-gold { 0%,100% { box-shadow: 0 0 0 0 rgba(232,112,106,0.4); } 50% { box-shadow: 0 0 0 6px rgba(232,112,106,0); } }
      `}</style>
    </div>
  )
}
