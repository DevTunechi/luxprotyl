'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        paddingTop: 64,
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>

        {/* Deep forest + burgundy atmosphere */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 70% 70% at 100% 0%,   rgba(92,26,40,0.45)  0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 0%  100%,  rgba(10,31,18,0.8)   0%, transparent 50%),
            radial-gradient(ellipse 40% 40% at 50% 50%,   rgba(201,148,58,0.04) 0%, transparent 60%)
          `,
        }} />

        {/* Kente geometric grid — large, crisp */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          opacity: 0.035,
          backgroundImage: `
            repeating-linear-gradient(0deg,   transparent 0px, transparent 26px, rgba(201,148,58,0.8) 26px, rgba(201,148,58,0.8) 27px),
            repeating-linear-gradient(90deg,  transparent 0px, transparent 26px, rgba(201,148,58,0.8) 26px, rgba(201,148,58,0.8) 27px),
            repeating-linear-gradient(45deg,  transparent 0px, transparent 12px, rgba(201,148,58,0.5) 12px, rgba(201,148,58,0.5) 13px),
            repeating-linear-gradient(-45deg, transparent 0px, transparent 12px, rgba(201,148,58,0.5) 12px, rgba(201,148,58,0.5) 13px)
          `,
        }} />

        {/* Gold vignette at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to top, rgba(10,31,18,0.6) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* ── INNER GRID ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 1440, margin: '0 auto',
          padding: 'clamp(40px,6vw,100px) clamp(20px,5vw,80px)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          gap: 'clamp(32px,5vw,72px)',
          alignItems: 'center',
        }}>

          {/* LEFT */}
          <div>
            <div className="compliance-badge fade-up d-0" style={{ marginBottom: 28 }}>
              ✦ &nbsp;Fully Compliant · Nigerian Housing Laws &amp; Ecosystem
            </div>

            <h1
              className="fade-up d-1"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 'clamp(38px, 4.8vw, 74px)',
                fontWeight: 900,
                lineHeight: 1.02,
                color: 'var(--text-primary)',
                marginBottom: 24,
                letterSpacing: '-0.01em',
              }}
            >
              Property<br />
              management<br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>reimagined</em> for<br />
              <span style={{
                color: 'var(--gold)',
                position: 'relative',
                display: 'inline-block',
              }}>
                African landlords.
                <span style={{
                  position: 'absolute', bottom: -4, left: 0, right: 0, height: 3,
                  background: 'linear-gradient(90deg, var(--burg-light), var(--gold))',
                  borderRadius: 2,
                }} />
              </span>
            </h1>

            <p
              className="fade-up d-2"
              style={{
                fontSize: 'clamp(15px, 1.4vw, 18px)',
                lineHeight: 1.75,
                fontWeight: 300,
                color: 'var(--text-secondary)',
                maxWidth: 480,
                marginBottom: 40,
              }}
            >
              LuxProptyl is the intelligent digital agent between you and your
              tenants — collect rent, enforce leases, manage short-stays and
              Airbnb properties, all in one premium platform.
            </p>

            <div className="fade-up d-3" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/auth/register">
                <button className="btn-gold" style={{ fontSize: 15, padding: '14px 36px' }}>
                  Start Managing Free
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="btn-ghost" style={{ fontSize: 15, padding: '14px 36px' }}>
                  Sign In →
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT — glass cards */}
          <div className="slide-right d-2" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Revenue */}
            <div className="glass-card" style={{ padding: '22px 26px' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>
                Portfolio Revenue · March 2026
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(26px,3vw,40px)', fontWeight: 700, color: 'var(--gold)', lineHeight: 1, marginBottom: 6 }}>
                ₦7,240,000
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Across 12 properties · 21 units</p>
              <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', width: '82%', borderRadius: 99, background: 'linear-gradient(90deg, var(--burg-light), var(--gold))' }} />
              </div>
            </div>

            {/* Payments */}
            <div className="glass-card" style={{ padding: '22px 26px' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 14 }}>
                Active Payments This Week
              </p>
              {[
                { name: 'Adaeze Okonkwo · VI Apartments', amt: '₦650k', dot: '#2EAE78', tag: 'Long-term',  tc: 'var(--gold)',  tb: 'rgba(201,148,58,0.12)' },
                { name: 'Airbnb Guest · Ikoyi Suite',      amt: '₦85k',  dot: '#FF5A1F', tag: 'Short-stay', tc: '#FF5A1F',      tb: 'rgba(255,90,31,0.1)' },
                { name: 'Blessing Nwachukwu · Surulere',   amt: '₦320k', dot: '#D4A017', tag: 'Long-term',  tc: 'var(--gold)',  tb: 'rgba(201,148,58,0.12)' },
                { name: 'Emmanuel Eze · Yaba Studio',      amt: '₦180k', dot: '#C0392B', tag: 'Overdue',    tc: '#E8706A',      tb: 'rgba(192,57,43,0.12)' },
              ].map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 0',
                  borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: r.dot, boxShadow: `0 0 7px ${r.dot}`, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--gold)', flexShrink: 0 }}>{r.amt}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: r.tb, color: r.tc, flexShrink: 0 }}>{r.tag}</span>
                </div>
              ))}
            </div>

            {/* Airbnb */}
            <div className="glass-card" style={{ padding: '18px 26px', background: 'rgba(92,26,40,0.2)', borderColor: 'rgba(125,36,56,0.4)' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>
                Airbnb Sync Status
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>🏠</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Ikoyi Suite · Synced</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Next: Mar 14–17 · 3 nights · ₦255,000</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF5A1F', boxShadow: '0 0 7px rgba(255,90,31,0.7)', animation: 'pulse-gold 2s infinite', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#FF7A3F' }}>Airbnb Calendar Active · iCal Syncing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive: stack on mobile */}
        <style>{`
          @media (max-width: 860px) {
            .hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid var(--divider-gold)', borderBottom: '1px solid var(--divider-gold)', background: 'rgba(201,148,58,0.02)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[
              { num: '3,800+', label: 'Properties Managed' },
              { num: '₦4.1B',  label: 'Rent Collected' },
              { num: '36',     label: 'States Covered' },
              { num: '99.4%',  label: 'Uptime Reliability' },
            ].map((s, i) => (
              <div
                key={i}
                className="fade-in"
                style={{
                  textAlign: 'center',
                  padding: 'clamp(28px,4vw,48px) 16px',
                  borderRight: i < 3 ? '1px solid var(--divider-gold)' : 'none',
                  animationDelay: `${i * 120}ms`,
                }}
              >
                <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(30px,4vw,52px)', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontSize: 10.5, marginTop: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          COMPLIANCE
      ══════════════════════════════════════ */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(40px,5vw,72px) clamp(20px,5vw,80px) 20px' }}>
        <div
          className="fade-up d-2"
          style={{
            borderRadius: 22,
            padding: 'clamp(30px,4vw,56px)',
            display: 'flex', alignItems: 'flex-start', gap: 28,
            background: 'linear-gradient(135deg, rgba(22,53,32,0.9) 0%, rgba(15,41,24,0.95) 100%)',
            border: '1px solid rgba(46,174,120,0.22)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(46,174,120,0.1)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Subtle Kente inside compliance card */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
            backgroundImage: `repeating-linear-gradient(45deg, rgba(46,174,120,1) 0px, rgba(46,174,120,1) 1px, transparent 1px, transparent 20px)`,
          }} />
          <span style={{ fontSize: 'clamp(30px,4vw,48px)', flexShrink: 0 }}>⚖️</span>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(20px,2.4vw,30px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
              Fully Compliant with Nigerian Housing Laws &amp; Ecosystem
            </h2>
            <p style={{ fontSize: 'clamp(13px,1.2vw,15px)', lineHeight: 1.75, fontWeight: 300, color: 'var(--text-secondary)', maxWidth: 720, marginBottom: 20 }}>
              Every document, notice, and agreement generated on LuxProptyl is grounded in the Lagos State Tenancy Law 2011 — enforced as our national standard. From quit notices to tenancy agreements, we generate legally sound documents so you&apos;re always protected.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Lagos State Tenancy Law 2011','LASG Compliant Quit Notices','NIN / BVN Verified','CBN-Licensed Payment Processing','National Coverage · All 36 States'].map(t => (
                <span key={t} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'rgba(46,174,120,0.12)', color: '#6EDBA8', border: '1px solid rgba(46,174,120,0.22)', letterSpacing: '0.03em' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AD SLOT */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '16px clamp(20px,5vw,80px)' }}>
        <div style={{ height: 80, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.015)', border: '1px dashed rgba(201,148,58,0.1)' }}>
          <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,148,58,0.18)', fontWeight: 600 }}>Google Ads — Leaderboard 728×90</span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(20px,3vw,40px) clamp(20px,5vw,80px) clamp(60px,8vw,100px)' }}>
        <p className="eyebrow fade-up d-0" style={{ marginBottom: 14 }}>Everything You Need</p>
        <h2
          className="fade-up d-1"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(34px,4.5vw,60px)',
            fontWeight: 900,
            lineHeight: 1.06,
            color: 'var(--text-primary)',
            marginBottom: 16,
            letterSpacing: '-0.01em',
          }}
        >
          One platform.<br />
          <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Infinite control.</em>
        </h2>
        <p className="fade-up d-2" style={{ fontSize: 'clamp(14px,1.3vw,16px)', fontWeight: 300, color: 'var(--text-secondary)', maxWidth: 500, lineHeight: 1.75, marginBottom: 52 }}>
          Whether you&apos;re managing a three-bedroom flat in Lekki or a luxury Airbnb suite in Ikoyi — LuxProptyl adapts to how you do property.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
          gap: 1,
          borderRadius: 22,
          overflow: 'hidden',
          background: 'rgba(201,148,58,0.06)',
          border: '1px solid rgba(201,148,58,0.1)',
        }}>
          {[
            { icon: '🏠', title: 'Smart Portfolio Dashboard',  desc: 'All properties, all tenants, all payments — unified across long-term and short-stay modes in a single command centre.', tag: 'Long-term & Short-stay', tc: '#2EAE78', tb: 'rgba(46,174,120,0.12)' },
            { icon: '💳', title: 'Digital Rent Collection',    desc: 'Tenants pay via Paystack — card, bank transfer, or USSD. Auto-receipts sent instantly. Proof of payment uploads supported.', tag: 'Long-term', tc: 'var(--gold)', tb: 'rgba(201,148,58,0.12)' },
            { icon: '📅', title: 'Airbnb Calendar Sync',       desc: 'Two-way iCal sync with Airbnb. A booking on either platform blocks both. Guest revenue tracked alongside long-term rent.', tag: 'Short-stay', tc: '#FF5A1F', tb: 'rgba(255,90,31,0.1)' },
            { icon: '🔔', title: 'Lease Expiry Alerts',        desc: 'Automated notifications 3 months and 1 month before lease expiry. Never be caught off guard by a departing tenant.', tag: 'Long-term', tc: 'var(--gold)', tb: 'rgba(201,148,58,0.12)' },
            { icon: '🧹', title: 'Cleaning Crew Scheduling',   desc: 'Automatically schedule your cleaning team between guest checkouts and next check-ins. Keep your short-stay reviews perfect.', tag: 'Short-stay', tc: '#FF5A1F', tb: 'rgba(255,90,31,0.1)' },
            { icon: '⚖️', title: 'Legal Notice Generator',     desc: 'Generate Lagos State-compliant quit notices, tenancy agreements, and breach letters — delivered digitally by email or WhatsApp.', tag: 'Long-term', tc: 'var(--gold)', tb: 'rgba(201,148,58,0.12)' },
            { icon: '💬', title: 'Twilio In-App Messaging',    desc: 'Landlord-tenant communication fully logged and archived. No more WhatsApp confusion — all in one verified thread.', tag: 'Both', tc: '#2EAE78', tb: 'rgba(46,174,120,0.12)' },
            { icon: '🔗', title: 'Persistent Tenant Links',    desc: 'Each unit gets a unique invite link — active for the life of the lease, auto-expired on end date. Tamper-proof and traceable.', tag: 'Long-term', tc: 'var(--gold)', tb: 'rgba(201,148,58,0.12)' },
            { icon: '⭐', title: 'Guest Reviews & Ratings',    desc: 'Build your short-stay reputation on the platform. Guests review stays, owners rate guests. Full accountability on both sides.', tag: 'Short-stay', tc: '#FF5A1F', tb: 'rgba(255,90,31,0.1)' },
          ].map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 60} />
          ))}
        </div>
      </div>

      {/* RESPONSIVE */}
      <style>{`
        @media (max-width: 860px) {
          .features-inner { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
        }
        @media (max-width: 540px) {
          .features-inner { grid-template-columns: 1fr !important; }
          .trust-inner    { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </main>
  )
}

function FeatureCard({ icon, title, desc, tag, tc, tb, delay }: {
  icon: string; title: string; desc: string; tag: string; tc: string; tb: string; delay: number
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className={`feature-card fade-up`}
      style={{ background: 'var(--bg-surface)', animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ padding: 'clamp(24px,2.5vw,38px)' }}>
        <div style={{
          width: 50, height: 50, borderRadius: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, marginBottom: 20,
          background: hov ? 'rgba(201,148,58,0.15)' : 'rgba(201,148,58,0.08)',
          border: `1px solid ${hov ? 'rgba(201,148,58,0.35)' : 'rgba(201,148,58,0.18)'}`,
          transition: 'all 0.25s ease',
          boxShadow: hov ? '0 4px 16px rgba(201,148,58,0.15)' : 'none',
        }}>
          {icon}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(15px,1.3vw,18px)',
          fontWeight: 700,
          color: hov ? 'var(--gold)' : 'var(--text-primary)',
          marginBottom: 10,
          transition: 'color 0.25s ease',
          letterSpacing: '-0.01em',
        }}>
          {title}
        </h3>
        <p style={{ fontSize: 'clamp(12px,1vw,14px)', lineHeight: 1.7, fontWeight: 300, color: 'var(--text-muted)', marginBottom: 18 }}>
          {desc}
        </p>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: tb, color: tc, letterSpacing: '0.05em' }}>
          {tag}
        </span>
      </div>
    </div>
  )
}
