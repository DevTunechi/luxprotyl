#!/bin/bash
# Run from repo ROOT: bash fix-premium.sh

# ════════════════════════════════
# 1. GLOBALS.CSS — grain + animations + all variables
# ════════════════════════════════
cat > apps/web/src/app/globals.css << 'CSSEOF'
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Outfit:wght@200;300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {

  /* ══ DARK MODE (default) ══ */
  :root, .dark {
    --bg-base:           #0A1F12;
    --bg-surface:        #0F2918;
    --bg-elevated:       #163520;
    --gold:              #C9943A;
    --gold-light:        #E3B86A;
    --gold-pale:         #F5E6C8;
    --gold-subtle:       rgba(201,148,58,0.1);
    --gold-border:       rgba(201,148,58,0.22);
    --burg:              #5C1A28;
    --burg-light:        #7D2438;
    --burg-subtle:       rgba(92,26,40,0.2);
    --text-primary:      #F5EDD8;
    --text-secondary:    #C8BCA8;
    --text-muted:        #8A8070;
    --text-inverse:      #0A1F12;
    --glass-bg:          rgba(15,41,24,0.7);
    --glass-border:      rgba(201,148,58,0.22);
    --glass-shadow:      0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
    --card-bg:           rgba(15,41,24,0.8);
    --card-border:       rgba(201,148,58,0.18);
    --sidebar-bg:        #0A1F12;
    --sidebar-border:    rgba(201,148,58,0.1);
    --sidebar-active-bg: rgba(201,148,58,0.08);
    --input-bg:          rgba(255,255,255,0.05);
    --input-border:      rgba(201,148,58,0.25);
    --input-placeholder: rgba(245,237,216,0.25);
    --input-text:        #F5EDD8;
    --success:           #2EAE78;
    --success-bg:        rgba(46,174,120,0.12);
    --warning:           #D4A017;
    --warning-bg:        rgba(212,160,23,0.12);
    --danger:            #C0392B;
    --danger-bg:         rgba(192,57,43,0.12);
    --divider:           rgba(201,148,58,0.08);
    --divider-gold:      rgba(201,148,58,0.15);
    --nav-bg:            rgba(8,24,14,0.94);
    --nav-border:        rgba(201,148,58,0.14);
    --toast-bg:          #163520;
    --toast-color:       #F5EDD8;
    --toast-border:      rgba(201,148,58,0.2);
    --scrollbar-thumb:   rgba(201,148,58,0.2);
    --shadow-sm:         0 2px 8px rgba(0,0,0,0.3);
    --shadow-md:         0 4px 20px rgba(0,0,0,0.4);
    --shadow-lg:         0 8px 48px rgba(0,0,0,0.5);
    --shadow-gold:       0 6px 28px rgba(201,148,58,0.3);
    --shimmer-from:      rgba(255,255,255,0.02);
    --shimmer-to:        rgba(255,255,255,0.06);
  }

  /* ══ LIGHT MODE ══ */
  .light {
    --bg-base:           #F0E8D5;
    --bg-surface:        #FAF6EE;
    --bg-elevated:       #FFFFFF;
    --gold:              #9A6E20;
    --gold-light:        #B8883A;
    --gold-pale:         #F5E6C8;
    --gold-subtle:       rgba(154,110,32,0.08);
    --gold-border:       rgba(154,110,32,0.28);
    --burg:              #6B1E2E;
    --burg-light:        #8C2A3E;
    --burg-subtle:       rgba(107,30,46,0.08);
    --text-primary:      #0A1F12;
    --text-secondary:    #2E4035;
    --text-muted:        #6A7A70;
    --text-inverse:      #F5EDD8;
    --glass-bg:          rgba(255,255,255,0.75);
    --glass-border:      rgba(154,110,32,0.22);
    --glass-shadow:      0 4px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
    --card-bg:           rgba(255,255,255,0.9);
    --card-border:       rgba(154,110,32,0.18);
    --sidebar-bg:        #0A1F12;
    --sidebar-border:    rgba(201,148,58,0.15);
    --sidebar-active-bg: rgba(201,148,58,0.1);
    --input-bg:          #FFFFFF;
    --input-border:      rgba(154,110,32,0.3);
    --input-placeholder: rgba(10,31,18,0.3);
    --input-text:        #0A1F12;
    --success:           #1E8A5C;
    --success-bg:        rgba(30,138,92,0.1);
    --warning:           #B8860B;
    --warning-bg:        rgba(184,134,11,0.1);
    --danger:            #A0291E;
    --danger-bg:         rgba(160,41,30,0.1);
    --divider:           rgba(154,110,32,0.12);
    --divider-gold:      rgba(154,110,32,0.18);
    --nav-bg:            rgba(8,24,14,0.97);
    --nav-border:        rgba(201,148,58,0.18);
    --toast-bg:          #FFFFFF;
    --toast-color:       #0A1F12;
    --toast-border:      rgba(154,110,32,0.2);
    --scrollbar-thumb:   rgba(154,110,32,0.25);
    --shadow-sm:         0 1px 4px rgba(0,0,0,0.06);
    --shadow-md:         0 4px 16px rgba(0,0,0,0.1);
    --shadow-lg:         0 8px 32px rgba(0,0,0,0.14);
    --shadow-gold:       0 4px 20px rgba(154,110,32,0.25);
    --shimmer-from:      rgba(0,0,0,0.03);
    --shimmer-to:        rgba(0,0,0,0.07);
  }

  /* ══ BASE ══ */
  * { border-color: var(--divider); box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-family: var(--font-outfit), 'Outfit', sans-serif;
    transition: background-color 0.35s ease, color 0.25s ease;
    -webkit-font-smoothing: antialiased;
  }
  h1,h2,h3,h4,h5,h6 {
    font-family: var(--font-playfair), 'Playfair Display', serif;
    color: var(--text-primary);
  }
  :focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
  ::-webkit-scrollbar       { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px; }
}

@layer components {

  /* ══ GRAIN OVERLAY — fixed across entire UI ══ */
  .grain-overlay {
    position: fixed;
    inset: 0;
    z-index: 9998;
    pointer-events: none;
    opacity: 0.032;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='1'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* ══ GLASS CARD ══ */
  .glass-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: var(--glass-shadow);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .glass-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 56px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
    border-color: rgba(201,148,58,0.38);
  }

  /* ══ FEATURE CARD — gold underline hover ══ */
  .feature-card {
    position: relative;
    overflow: hidden;
    transition: background 0.25s ease;
  }
  .feature-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--burg-light), var(--gold), var(--burg-light));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .feature-card:hover::after { transform: scaleX(1); }
  .feature-card:hover { background: var(--bg-elevated) !important; }

  /* ══ GOLD BUTTON ══ */
  .btn-gold {
    display: inline-flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #D4A040 0%, #8A5E18 100%);
    color: #0A1F12;
    font-weight: 700;
    font-family: var(--font-outfit), sans-serif;
    padding: 12px 28px; border-radius: 8px; border: none; cursor: pointer;
    box-shadow: var(--shadow-gold);
    transition: all 0.25s ease;
    letter-spacing: 0.3px; font-size: 14px; position: relative; overflow: hidden;
  }
  .btn-gold::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.25s ease;
  }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,148,58,0.45); }
  .btn-gold:hover::before { opacity: 1; }
  .btn-gold:active { transform: translateY(0); }

  /* ══ GHOST BUTTON ══ */
  .btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    background: transparent; color: var(--text-secondary);
    border: 1px solid var(--gold-border); padding: 12px 28px;
    border-radius: 8px; cursor: pointer;
    font-family: var(--font-outfit), sans-serif;
    font-size: 14px; font-weight: 500; transition: all 0.2s ease;
  }
  .btn-ghost:hover {
    color: var(--gold); border-color: var(--gold);
    background: var(--gold-subtle);
    transform: translateY(-1px);
  }

  /* ══ INPUT ══ */
  .lux-input {
    width: 100%; background: var(--input-bg);
    border: 1.5px solid var(--input-border); border-radius: 9px;
    padding: 13px 16px; font-size: 15px; color: var(--input-text);
    font-family: var(--font-outfit), sans-serif; outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .lux-input::placeholder { color: var(--input-placeholder); }
  .lux-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,148,58,0.12);
    background: rgba(255,255,255,0.07);
  }

  /* ══ KPI CARD ══ */
  .kpi-card {
    background: var(--card-bg); border: 1px solid var(--card-border);
    border-radius: 14px; padding: 22px 20px;
    position: relative; overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .kpi-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,148,58,0.6), transparent);
  }
  .kpi-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

  /* ══ EYEBROW ══ */
  .eyebrow {
    display: inline-block;
    font-size: 10px; color: var(--gold);
    letter-spacing: 0.22em; text-transform: uppercase; font-weight: 700;
    font-family: var(--font-outfit), sans-serif;
  }

  /* ══ COMPLIANCE BADGE ══ */
  .compliance-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 16px; background: rgba(46,174,120,0.1);
    border: 1px solid rgba(46,174,120,0.28); border-radius: 5px;
    font-size: 10.5px; font-weight: 700; color: #6EDBA8;
    letter-spacing: 0.1em; text-transform: uppercase;
    font-family: var(--font-outfit), sans-serif;
  }

  /* ══ SHIMMER ══ */
  .shimmer {
    background: linear-gradient(90deg, var(--shimmer-from) 25%, var(--shimmer-to) 50%, var(--shimmer-from) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }

  /* ══ STAGGERED FADE-IN ANIMATIONS ══ */
  .fade-up {
    opacity: 0;
    animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .fade-in {
    opacity: 0;
    animation: fadeIn 0.6s ease forwards;
  }
  .slide-right {
    opacity: 0;
    animation: slideRight 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .d-0  { animation-delay: 0ms; }
  .d-1  { animation-delay: 100ms; }
  .d-2  { animation-delay: 200ms; }
  .d-3  { animation-delay: 300ms; }
  .d-4  { animation-delay: 400ms; }
  .d-5  { animation-delay: 500ms; }
  .d-6  { animation-delay: 600ms; }
  .d-7  { animation-delay: 700ms; }
  .d-8  { animation-delay: 800ms; }
  .d-9  { animation-delay: 900ms; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,148,58,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(201,148,58,0); }
  }
}
CSSEOF

echo "✅ globals.css done"

# ════════════════════════════════
# 2. GRAIN OVERLAY COMPONENT
# ════════════════════════════════
cat > apps/web/src/components/ui/grain.tsx << 'EOF'
export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />
}
EOF

echo "✅ GrainOverlay component done"

# ════════════════════════════════
# 3. UPDATE LAYOUT — add grain
# ════════════════════════════════
cat > apps/web/src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import { Playfair_Display, Outfit, DM_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { Navbar } from '@/components/layout/navbar'
import { GrainOverlay } from '@/components/ui/grain'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const outfit   = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' })
const dmMono   = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'LuxProptyl — Premium Property Management',
  description: "Nigeria's premium digital property management platform. Fully compliant with Nigerian Housing Laws.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('luxproptyl-theme');
              var cl = document.documentElement.classList;
              if (!t || t === 'dark') { cl.add('dark'); cl.remove('light'); }
              else                    { cl.add('light'); cl.remove('dark'); }
            } catch(e) { document.documentElement.classList.add('dark'); }
          })();
        `}} />
      </head>
      <body
        className={`${playfair.variable} ${outfit.variable} ${dmMono.variable} font-outfit antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="luxproptyl-theme">
          <QueryProvider>
            {/* Grain texture across the entire UI */}
            <GrainOverlay />
            <Navbar />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)',
                  fontFamily: 'var(--font-outfit)',
                  borderRadius: '10px',
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
EOF

echo "✅ layout.tsx updated with GrainOverlay"

# ════════════════════════════════
# 4. HOMEPAGE — full premium version
# ════════════════════════════════
cat > apps/web/src/app/page.tsx << 'TSX'
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
TSX

echo "✅ Homepage done"
echo ""
echo "════════════════════════════════════════════"
echo "✅ All premium features implemented:"
echo "   ✦ Deep forest + burgundy + gold palette"
echo "   ✦ Playfair Display serif headlines"
echo "   ✦ Grain texture overlay (fixed, site-wide)"
echo "   ✦ Glassmorphism cards with gold borders"
echo "   ✦ Kente geometric grid (hero + compliance)"
echo "   ✦ Staggered fade-up / slide-right animations"
echo "   ✦ Gold underline hover on feature cards"
echo "   ✦ Gold title colour on feature card hover"
echo "   ✦ Icon box glow on hover"
echo "   ✦ Pulse animation on Airbnb sync dot"
echo "════════════════════════════════════════════"