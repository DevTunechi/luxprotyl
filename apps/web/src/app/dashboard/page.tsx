import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { KpiCard } from '@/components/ui/kpi-card'
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/card'
import { StatusPill } from '@/components/ui/status-pill'
import { formatNaira } from '@/lib/utils'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Good morning, Emeka 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Monday, 9 March 2026 · Lagos, Nigeria
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-ghost text-sm px-4 py-2">+ Add Property</button>
            <button className="btn-gold text-sm px-4 py-2">+ Invite Tenant</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <KpiCard label="Total Properties" value="12"       icon="🏠" delta="↑ +1 this quarter"  deltaType="up" />
          <KpiCard label="Monthly Revenue"  value="₦7.24M"   icon="💰" delta="↑ +18% vs last month" deltaType="up" />
          <KpiCard label="Overdue Payments" value="3"        icon="⚠️" delta="↑ +1 vs last month"  deltaType="down" />
          <KpiCard label="Active Bookings"  value="2"        icon="🏨" delta="Short-stay · This week" deltaType="neutral" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-3 gap-5">
          {/* Payments table */}
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <span className="text-xs cursor-pointer" style={{ color: 'var(--gold)' }}>View all →</span>
              </CardHeader>
              <div>
                {[
                  { name: 'Adaeze Okonkwo',     prop: 'VI Apartments',     amount: 650000,  date: 'Mar 1',    status: 'paid'    as const },
                  { name: 'Airbnb Guest ★4.9',  prop: 'Ikoyi Suite',       amount: 255000,  date: 'Mar 8',    status: 'airbnb'  as const },
                  { name: 'Tunde Adeyemi',       prop: 'Lekki Courts',      amount: 480000,  date: 'Feb 28',   status: 'paid'    as const },
                  { name: 'Blessing Nwachukwu',  prop: 'Surulere Heights',  amount: 320000,  date: 'Due Mar 5', status: 'due'    as const },
                  { name: 'Emmanuel Eze',        prop: 'Yaba Studio',       amount: 180000,  date: 'Due Feb 20', status: 'overdue' as const },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="grid gap-4 px-5 py-3.5 text-sm transition-colors"
                    style={{
                      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 80px',
                      borderBottom: '1px solid var(--divider)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.name}</span>
                    <span>{row.prop}</span>
                    <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{formatNaira(row.amount)}</span>
                    <span>{row.date}</span>
                    <StatusPill status={row.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <span className="text-xs cursor-pointer" style={{ color: 'var(--gold)' }}>Clear all</span>
            </CardHeader>
            <div>
              {[
                { dot: 'bg-red-400',     text: 'Emmanuel Eze is 17 days overdue — ₦180,000',         meta: 'Yaba Studio · Long-term' },
                { dot: 'bg-yellow-400',  text: "Tunde Adeyemi's lease expires in 78 days",            meta: 'Lekki Courts Unit 7' },
                { dot: 'bg-emerald-400', text: 'New Airbnb booking synced — Mar 14–17',               meta: 'Ikoyi Suite · 3 nights' },
                { dot: 'bg-blue-400',    text: 'Cleaning due at Ikoyi Suite · Mar 14 by 10am',        meta: 'Short-stay · Schedule crew' },
                { dot: 'bg-yellow-400',  text: 'Blessing Nwachukwu uploaded proof of payment',        meta: 'Surulere Heights · Verify' },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="flex gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: '1px solid var(--divider)' }}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${alert.dot}`} />
                  <div>
                    <p className="text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{alert.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{alert.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
