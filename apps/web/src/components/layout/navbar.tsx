'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { DarkModeToggle } from '@/components/ui/dark-mode-toggle'

export function Navbar() {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/properties') ||
    pathname?.startsWith('/tenants')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 48px)',
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--nav-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        {/* Brand */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-playfair), Playfair Display, serif',
            fontSize: 'clamp(17px, 2vw, 22px)',
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: '#F5EDD8',
          }}>
            Lux<em style={{ fontStyle: 'normal', color: 'var(--gold)' }}>Proptyl</em>
          </span>
        </Link>

        {/* Desktop right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="nav-desktop">
          <DarkModeToggle />
          {!isDashboard && (
            <>
              <Link href="/auth/login">
                <button className="btn-ghost" style={{ padding: '8px 20px', fontSize: 13 }}>
                  Sign In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="btn-gold" style={{ padding: '8px 20px', fontSize: 13 }}>
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#F5EDD8', fontSize: 22, padding: 8,
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 49,
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--nav-border)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }} className="nav-mobile">
          <DarkModeToggle />
          {!isDashboard && (
            <>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                <button className="btn-ghost" style={{ width: '100%', padding: '12px', fontSize: 14 }}>Sign In</button>
              </Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                <button className="btn-gold" style={{ width: '100%', padding: '12px', fontSize: 14 }}>Get Started</button>
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        .nav-mobile { display: none; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
      `}</style>
    </>
  )
}
