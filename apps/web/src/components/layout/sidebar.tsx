'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: '📊', label: 'Dashboard',   href: '/dashboard' },
      { icon: '🏠', label: 'Properties',  href: '/properties', badge: null },
      { icon: '👥', label: 'Tenants',     href: '/tenants' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { icon: '💳', label: 'Payments',    href: '/payments' },
      { icon: '📈', label: 'Reports',     href: '/reports' },
      { icon: '🏦', label: 'Payouts',     href: '/payouts' },
    ],
  },
  {
    label: 'Short-Stay / Airbnb',
    items: [
      { icon: '🏨', label: 'Bookings',    href: '/bookings' },
      { icon: '📅', label: 'Calendar',    href: '/calendar' },
      { icon: '🧹', label: 'Cleaning',    href: '/cleaning' },
      { icon: '⭐', label: 'Reviews',     href: '/reviews' },
    ],
  },
  {
    label: 'Legal & Notices',
    items: [
      { icon: '📄', label: 'Documents',   href: '/documents' },
      { icon: '⚖️', label: 'Notices',     href: '/notices' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { icon: '💬', label: 'Messages',    href: '/messages' },
      { icon: '🔔', label: 'Notifications', href: '/notifications' },
    ],
  },
  {
    label: 'Account',
    items: [
      { icon: '👤', label: 'Profile',     href: '/profile' },
      { icon: '⚙️', label: 'Settings',   href: '/settings' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-y-auto"
      style={{
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      {/* User block */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--divider)' }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-playfair font-bold text-base mb-3"
          style={{
            background: 'linear-gradient(135deg, var(--gold), #8A5E18)',
            color: 'var(--forest)',
          }}
        >
          CJ
        </div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Chukwuemeka Johnson
        </p>
        <span
          className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
          style={{ background: 'var(--gold-subtle)', color: 'var(--gold)' }}
        >
          Pro · 12 units
        </span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 py-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="text-[10px] font-bold uppercase tracking-widest px-5 mt-5 mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-150',
                    'border-l-2',
                    active
                      ? 'border-l-[var(--gold)] font-medium'
                      : 'border-l-transparent'
                  )}
                  style={{
                    color: active ? 'var(--gold)' : 'var(--text-muted)',
                    background: active ? 'var(--sidebar-active-bg)' : 'transparent',
                  }}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
