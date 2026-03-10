import Link from 'next/link'

function FeatureCard({ icon, title, desc, tag }: { icon: string; title: string; desc: string; tag: string }) {
  return (
    <div className="feature-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,148,58,0.15)', borderRadius: 16, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(201,148,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
      <span style={{ alignSelf: 'flex-start', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(201,148,58,0.1)', color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tag}</span>
    </div>
  )
}

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 'clamp(90px, 14vw, 120px)', paddingBottom: 'clamp(48px, 8vw, 80px)', paddingLeft: 'clamp(16px, 5vw, 80px)', paddingRight: 'clamp(16px, 5vw, 80px)', maxWidth: 1400, margin: '0 auto', position: 'relative' }}>

        {/* Atmosphere */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 70% 60% at 60% 20%, rgba(92,26,40,0.3) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(201,148,58,0.07) 0%, transparent 55%)` }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.02, backgroundImage: `repeating-linear-gradient(45deg, rgba(201,148,58,1) 0px, rgba(201,148,58,1) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(-45deg, rgba(201,148,58,1) 0px, rgba(201,148,58,1) 1px, transparent 1px, transparent 28px)` }} />

        {/* Compliance badge */}
        <div className="compliance-badge fade-up d-0" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, marginBottom: 28, background: 'rgba(46,174,120,0.08)', border: '1px solid rgba(46,174,120,0.2)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EAE78', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2EAE78' }}>Fully Compliant · Nigerian Housing Laws & Ecosystem</span>
        </div>

        {/* Two column — stacks on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(24px,4vw,48px)', alignItems: 'center' }} className="hero-grid">

          {/* Left — text */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="fade-up d-1" style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(36px, 5.5vw, 72px)', fontWeight: 900, lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 'clamp(16px,3vw,24px)' }}>
              Property<br />
              management<br />
              <em style={{ fontStyle: 'italic', color: 'var(--cream)' }}>reimagined</em><br />
              for<br />
              <span style={{ color: 'var(--gold)' }}>African<br />landlords.</span>
            </h1>
            <p className="fade-up d-2" style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 'clamp(24px,4vw,36px)', maxWidth: 440 }}>
              LuxProptyl is the intelligent digital agent between you and your tenants — collect rent, enforce leases, manage short-stays and Airbnb properties, all in one premium platform.
            </p>
            <div className="fade-up d-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/auth/register">
                <button className="btn-gold" style={{ padding: 'clamp(12px,2vw,16px) clamp(24px,3vw,32px)', fontSize: 'clamp(13px,1.4vw,15px)', fontWeight: 700 }}>Start Managing Free</button>
              </Link>
              <Link href="/auth/login">
                <button className="btn-ghost" style={{ padding: 'clamp(12px,2vw,16px) clamp(24px,3vw,32px)', fontSize: 'clamp(13px,1.4vw,15px)' }}>Sign In →</button>
              </Link>
            </div>
          </div>

          {/* Right — cards */}
          <div className="fade-up d-2 hero-cards" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px,2vw,16px)', position: 'relative', zIndex: 2 }}>

            {/* Revenue card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(201,148,58,0.2)', borderRadius: 16, padding: 'clamp(16px,2.5vw,24px)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Portfolio Revenue · March 2026</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: 'var(--gold)', margin: '0 0 6px', lineHeight: 1 }}>₦7,240,000</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Across 12 properties · 21 units</p>
            </div>

            {/* Payments card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(201,148,58,0.15)', borderRadius: 16, padding: 'clamp(16px,2.5vw,24px)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Active Payments This Week</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { dot: '#2EAE78', amount: '₦650k',  tag: 'Long-term',  tagColor: '#2EAE78',  tagBg: 'rgba(46,174,120,0.12)' },
                  { dot: '#E8706A', amount: '₦85k',   tag: 'Short-stay', tagColor: '#E8706A',  tagBg: 'rgba(232,112,106,0.12)' },
                  { dot: '#D4A017', amount: '₦320k',  tag: 'Long-term',  tagColor: '#D4A017',  tagBg: 'rgba(212,160,23,0.12)' },
                  { dot: '#C0392B', amount: '₦180k',  tag: 'Overdue',    tagColor: '#C0392B',  tagBg: 'rgba(192,57,43,0.12)' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(13px,1.5vw,15px)', fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{r.amount}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: r.tagBg, color: r.tagColor, whiteSpace: 'nowrap' }}>{r.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Airbnb card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(201,148,58,0.15)', borderRadius: 16, padding: 'clamp(14px,2vw,20px)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Airbnb Sync Status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,148,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏠</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>Ikoyi Suite · Synced</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Next: Mar 14–17 · 3 nights · ₦255,000</p>
                </div>
              </div>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E8706A', animation: 'pulse-gold 2s infinite', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#E8706A', fontWeight: 600 }}>Airbnb Calendar Active · iCal Syncing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={{ borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)', padding: 'clamp(24px,4vw,32px) clamp(16px,5vw,80px)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(16px,3vw,32px)', textAlign: 'center' }} className="trust-grid">
          {[
            { value: '3,800+', label: 'Properties Managed' },
            { value: '₦4.1B',  label: 'Rent Collected' },
            { value: '36',     label: 'States Covered' },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: 'var(--gold)', margin: '0 0 4px', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 'clamp(10px,1.2vw,12px)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section style={{ padding: 'clamp(32px,5vw,64px) clamp(16px,5vw,80px)', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ background: 'rgba(46,174,120,0.06)', border: '1px solid rgba(46,174,120,0.15)', borderRadius: 20, padding: 'clamp(24px,4vw,40px)', display: 'flex', gap: 'clamp(16px,3vw,28px)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 'clamp(32px,5vw,48px)', flexShrink: 0 }}>⚖️</div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
              Fully Compliant with <span style={{ color: '#2EAE78' }}>Nigerian Law</span>
            </h2>
            <p style={{ fontSize: 'clamp(13px,1.4vw,15px)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 16px' }}>
              Built on the Lagos State Tenancy Law 2011, applied nationally. Every notice, lease, and eviction procedure follows Nigerian legal standards.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Lagos State Tenancy Law 2011', 'NDPR Compliant', 'All 36 States'].map((b, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: 'rgba(46,174,120,0.1)', color: '#2EAE78', border: '1px solid rgba(46,174,120,0.2)' }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: 'clamp(32px,5vw,64px) clamp(16px,5vw,80px)', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,48px)' }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Everything you need</p>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: 'var(--text-primary)', maxWidth: 600, margin: '0 auto' }}>
            Built for how Nigerian landlords actually work
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 'clamp(12px,2vw,20px)' }} className="features-grid">
          <FeatureCard icon="🏠" title="Smart Portfolio Dashboard"     desc="All properties, all tenants, all payments — unified across long-term and short-stay modes in a single command centre."     tag="Long-term & Short-stay" />
          <FeatureCard icon="💳" title="Digital Rent Collection"       desc="Tenants pay via Paystack — card, bank transfer, or USSD. Auto-receipts sent instantly. Proof of payment uploads supported." tag="Long-term" />
          <FeatureCard icon="📅" title="Airbnb Calendar Sync"          desc="Two-way iCal sync with Airbnb. A booking on either platform blocks both. Guest revenue tracked alongside long-term rent."   tag="Short-stay" />
          <FeatureCard icon="🔔" title="Automated Rent Reminders"      desc="Smart reminders sent via WhatsApp and email before due dates. Escalating alerts for overdue payments."                    tag="Long-term" />
          <FeatureCard icon="🧹" title="Cleaning & Maintenance"        desc="Schedule cleaners between Airbnb stays. Log maintenance requests. Track completion with photo evidence."                    tag="Short-stay" />
          <FeatureCard icon="⚖️" title="Legal Notice Generator"        desc="Generate compliant quit notices, rent demand letters, and tenancy agreements in one click. Lagos Law 2011 templates."       tag="Legal" />
          <FeatureCard icon="📊" title="Revenue Analytics"             desc="Monthly income breakdown, occupancy rates, and yield comparisons between long-term and short-stay for each property."       tag="Analytics" />
          <FeatureCard icon="🔗" title="Tenant Invite Links"           desc="Share a unique link with your tenant. They register, view their lease, and pay rent — no back-and-forth."                  tag="Onboarding" />
          <FeatureCard icon="📋" title="Lease Management"              desc="Create, renew, and terminate leases digitally. Expiry alerts 90 days in advance. Full audit trail for every change."        tag="Compliance" />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(48px,6vw,80px) clamp(16px,5vw,80px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'rgba(201,148,58,0.06)', border: '1px solid rgba(201,148,58,0.15)', borderRadius: 24, padding: 'clamp(32px,5vw,56px) clamp(24px,4vw,48px)' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 14 }}>
            Ready to manage <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>smarter</em>?
          </h2>
          <p style={{ fontSize: 'clamp(13px,1.5vw,16px)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
            Join thousands of Nigerian landlords already using LuxProptyl. Free to start, no credit card required.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register">
              <button className="btn-gold" style={{ padding: 'clamp(13px,2vw,16px) clamp(28px,3vw,40px)', fontSize: 'clamp(13px,1.4vw,15px)', fontWeight: 700 }}>Get Started Free →</button>
            </Link>
            <Link href="/auth/login">
              <button className="btn-ghost" style={{ padding: 'clamp(13px,2vw,16px) clamp(28px,3vw,40px)', fontSize: 'clamp(13px,1.4vw,15px)' }}>Sign In</button>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        /* Mobile: hero stacks, cards go full width */
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-cards {
            display: none !important;
          }
        }

        /* Tablet: 2-col features */
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, minmax(0,1fr)) !important;
          }
        }

        /* Mobile: 1-col features */
        @media (max-width: 560px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .trust-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
        }

        /* Feature card hover */
        .feature-card:hover {
          border-color: rgba(201,148,58,0.35) !important;
          background: rgba(201,148,58,0.05) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  )
}
