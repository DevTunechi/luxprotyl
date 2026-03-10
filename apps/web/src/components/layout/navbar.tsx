'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle'
import { useUser } from '@/hooks/use-user'
import { createBrowserClient } from '@supabase/ssr'

const NAV_LINKS = [
  { href: '/dashboard',   label: 'Dashboard' },
  { href: '/properties',  label: 'Properties' },
  { href: '/leases',      label: 'Leases' },
  { href: '/payments',    label: 'Payments' },
]

export function Navbar() {
  const pathname          = usePathname()
  const router            = useRouter()
  const { profile }       = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const isDashboard       = NAV_LINKS.some(l => pathname?.startsWith(l.href))
  const isLanding         = !isDashboard && !pathname?.startsWith('/auth') && !pathname?.startsWith('/onboarding') && !pathname?.startsWith('/invite')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,4vw,48px)', background: 'var(--nav-bg)', borderBottom: '1px solid var(--nav-border)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>

        {/* Brand */}
        <Link href={profile ? '/dashboard' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(17px,2vw,22px)', fontWeight: 700, letterSpacing: '0.02em', color: '#F5EDD8' }}>
            Lux<em style={{ fontStyle: 'normal', color: 'var(--gold)' }}>Proptyl</em>
          </span>
        </Link>

        {/* Desktop — dashboard nav */}
        {isDashboard && profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
                <span style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: pathname?.startsWith(l.href) ? 'var(--gold)' : 'rgba(245,237,216,0.6)', background: pathname?.startsWith(l.href) ? 'rgba(201,148,58,0.1)' : 'transparent', transition: 'all 0.15s', display: 'block' }}>
                  {l.label}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Desktop right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="nav-desktop">
          <DarkModeToggle />
          {profile ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(201,148,58,0.1)', border: '1px solid rgba(201,148,58,0.2)', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', color: '#F5EDD8' }}
              >
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), #8A5E18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-inverse)' }}>
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{profile.first_name}</span>
                <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
              </button>
              {dropOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 200, background: 'var(--bg-surface)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 8, boxShadow: 'var(--shadow-lg)', zIndex: 100 }}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--divider)', marginBottom: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{profile.first_name} {profile.last_name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{profile.email}</p>
                  </div>
                  {[
                    { label: '⚙️ Settings', href: '/settings' },
                    { label: '🏠 Properties', href: '/properties' },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setDropOpen(false)} style={{ textDecoration: 'none' }}>
                      <div style={{ padding: '9px 12px', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,148,58,0.07)'; (e.currentTarget as HTMLDivElement).style.color = 'var(--gold)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = 'var(--text-secondary)' }}
                      >{item.label}</div>
                    </Link>
                  ))}
                  <button onClick={signOut} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#E8706A', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', marginTop: 4, borderTop: '1px solid var(--divider)', paddingTop: 12 }}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : isLanding ? (
            <>
              <Link href="/auth/login"><button className="btn-ghost" style={{ padding: '8px 20px', fontSize: 13 }}>Sign In</button></Link>
              <Link href="/auth/register"><button className="btn-gold" style={{ padding: '8px 20px', fontSize: 13 }}>Get Started</button></Link>
            </>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button className="nav-mobile" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#F5EDD8', fontSize: 22, padding: 8 }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile" style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 49, background: 'var(--bg-surface)', borderBottom: '1px solid var(--nav-border)', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isDashboard && NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '12px 16px', borderRadius: 10, fontSize: 14, color: pathname?.startsWith(l.href) ? 'var(--gold)' : 'var(--text-secondary)', background: pathname?.startsWith(l.href) ? 'rgba(201,148,58,0.08)' : 'transparent' }}>{l.label}</div>
            </Link>
          ))}
          <DarkModeToggle />
          {!profile && <>
            <Link href="/auth/login" onClick={() => setMenuOpen(false)}><button className="btn-ghost" style={{ width: '100%', padding: 12, fontSize: 14 }}>Sign In</button></Link>
            <Link href="/auth/register" onClick={() => setMenuOpen(false)}><button className="btn-gold" style={{ width: '100%', padding: 12, fontSize: 14 }}>Get Started</button></Link>
          </>}
          {profile && <button onClick={signOut} style={{ padding: 12, background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 10, color: '#E8706A', fontSize: 14, cursor: 'pointer' }}>Sign Out</button>}
        </div>
      )}

      <style>{`
        .nav-mobile { display: none !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
