'use client'
import { useState } from 'react'
import Link from 'next/link'

type Role = 'landlord' | 'tenant'
type Step = 1 | 2

export default function RegisterPage() {
  const [role, setRole]         = useState<Role>('landlord')
  const [step, setStep]         = useState<Step>(1)
  const [loading, setLoading]   = useState(false)
  const [form, setForm]         = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
  })

  function update(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px 40px',
      background: 'var(--bg-base)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 55% 45% at 20% 10%,  rgba(201,148,58,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 50% 50% at 80% 90%,  rgba(92,26,40,0.2)   0%, transparent 55%)
        `,
      }} />

      {/* Kente */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.018,
        backgroundImage: `
          repeating-linear-gradient(45deg,  rgba(201,148,58,1) 0px, rgba(201,148,58,1) 1px, transparent 1px, transparent 28px),
          repeating-linear-gradient(-45deg, rgba(201,148,58,1) 0px, rgba(201,148,58,1) 1px, transparent 1px, transparent 28px)
        `,
      }} />

      {/* Card */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 14, marginBottom: 16,
            background: 'linear-gradient(135deg, var(--gold), #8A5E18)',
            boxShadow: '0 8px 24px rgba(201,148,58,0.3)',
          }}>
            <span style={{ fontSize: 22 }}>✦</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: 'clamp(26px, 3vw, 34px)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}>
            Join <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>LuxProptyl</em>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Nigeria&apos;s premium property management platform
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 20,
          padding: 'clamp(28px, 5vw, 40px)',
          boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
        }}>

          {/* Role toggle */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 6, padding: 5, borderRadius: 12, marginBottom: 28,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--glass-border)',
          }}>
            {([
              { value: 'landlord', label: '🏠  Landlord', sub: 'I own property' },
              { value: 'tenant',   label: '🧑‍💼  Tenant',   sub: 'I rent property' },
            ] as { value: Role; label: string; sub: string }[]).map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 9,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  background: role === r.value
                    ? 'linear-gradient(135deg, var(--gold), #8A5E18)'
                    : 'transparent',
                  color: role === r.value ? 'var(--text-inverse)' : 'var(--text-muted)',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700 }}>{r.label}</div>
                <div style={{ fontSize: 11, marginTop: 2, opacity: 0.8 }}>{r.sub}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Chukwuemeka"
                  value={form.firstName}
                  onChange={e => update('firstName', e.target.value)}
                  required
                  className="lux-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Johnson"
                  value={form.lastName}
                  onChange={e => update('lastName', e.target.value)}
                  required
                  className="lux-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
                className="lux-input"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+234 801 234 5678"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                required
                className="lux-input"
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                required
                minLength={8}
                className="lux-input"
              />
            </div>

            {/* Email verification notice */}
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '12px 14px', borderRadius: 10, marginBottom: 24,
              background: 'rgba(201,148,58,0.08)',
              border: '1px solid rgba(201,148,58,0.2)',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>📧</span>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                A verification email will be sent to your inbox.{' '}
                <strong style={{ color: 'var(--gold)' }}>You must verify your email to activate your account.</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 24 }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Compliance note */}
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 24, lineHeight: 1.6 }}>
          🔒 Secured by Supabase Auth · NDPR Compliant · Your data stays in Nigeria
        </p>
      </div>
    </div>
  )
}
