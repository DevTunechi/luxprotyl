'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your inbox'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', background: 'var(--bg-base)' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 60% 50% at 50% 30%, rgba(46,174,120,0.1) 0%, transparent 60%)` }} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>📬</div>
        <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 'clamp(24px,3vw,32px)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 16 }}>Check your inbox</h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 8 }}>
          We sent a verification link to
        </p>
        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--gold)', marginBottom: 32 }}>{email}</p>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
            Click the link in your email to verify your account and get started. Check your spam folder if you don&apos;t see it within a few minutes.
          </p>
        </div>
        <Link href="/auth/login" style={{ color: 'var(--gold)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>← Back to Sign In</Link>
      </div>
    </div>
  )
}
