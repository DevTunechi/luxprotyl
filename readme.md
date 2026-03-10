# LuxProptyl

> Nigeria's premium digital property management platform.

Manage long-term rentals and short-stay/Airbnb properties — rent collection, lease enforcement, legal notices, and guest bookings — all in one platform, fully compliant with Nigerian Housing Laws.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 · TypeScript · Tailwind CSS |
| Backend | Node.js · Express · TypeScript |
| Database + Auth | Supabase (PostgreSQL) |
| Payments | Paystack |
| Messaging | Twilio · WhatsApp Cloud API |
| Email | Resend |
| Maps | Google Maps API |
| Monorepo | Turborepo |
| Hosting | Vercel (web) · Railway (api) |

---

## Project Structure

```
luxproptyl/
├── apps/
│   ├── web/          # Next.js frontend  → :3000
│   └── api/          # Express backend   → :4000
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── shared/db/    # PostgreSQL schema
├── turbo.json
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+ · npm v9+
- A [Supabase](https://supabase.com) project

### 1. Install
```bash
git clone https://github.com/your-username/luxproptyl.git
cd luxproptyl && npm install
```

### 2. Database
In **Supabase → SQL Editor**, run the full contents of `packages/shared/db/schema.sql`.
Creates 12 tables, RLS policies, triggers, indexes, and views in the correct dependency order.

### 3. Environment variables

`apps/web/.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
```

`apps/api/.env`
```env
PORT=4000
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
PAYSTACK_SECRET_KEY=
JWT_SECRET=
```

### 4. Run
```bash
npm run dev
# web → localhost:3000 · api → localhost:4000
```

---

## Database

12 tables · 3 views · 8 triggers · 22 indexes · 16 RLS policies

`users` · `properties` · `leases` · `bookings` · `payments` · `notices` · `maintenance_requests` · `messages` · `notifications` · `calendar_blocks` · `cleaning_schedules` · `audit_logs`

**Views:** `v_landlord_portfolio` · `v_expiring_leases` · `v_overdue_payments`

---

## Features

**Landlord** — portfolio dashboard, automated rent collection via Paystack, lease expiry alerts (90-day + 30-day), LASG-compliant legal notice generator, persistent per-unit tenant invite links, tenant ID verification (NIN/BVN)

**Tenant** — onboard via invite link, pay via card / bank transfer / USSD, submit maintenance requests with photos, receive digital notices, view lease and payment history

**Short-Stay / Airbnb** — two-way Airbnb iCal sync, booking management, cleaning crew scheduling between stays, guest reviews and ratings, security deposit collection

---

## Cron Jobs

| Job | Schedule | Action |
|---|---|---|
| Lease expiry alerts | Daily 8am | Sends 90-day + 30-day notifications |
| Airbnb calendar sync | Every 4 hours | Pulls iCal, updates calendar blocks |
| Overdue payments | Daily 9am | Marks pending past-due payments as overdue |

---

## Legal & Compliance

- **Lagos State Tenancy Law 2011** — enforced as national standard across all 36 states
- **NDPR compliant** — user data stays in Nigeria
- **Paystack** — CBN-licensed payment processing
- **NIN / BVN** identity verification required for all tenants

---

## Design System

| Token | Value | Usage |
|---|---|---|
| Forest | `#0A1F12` | Page background |
| Burgundy | `#5C1A28` | Accents, atmosphere |
| Gold | `#C9943A` | CTAs, highlights, numbers |
| Cream | `#F5EDD8` | Primary text |

Playfair Display (headlines) · Outfit (body) · DM Mono (figures)

Glassmorphism cards · Kente geometric grid · Film grain overlay · Staggered fade-in animations · Dark mode default, light mode toggle

---

## License

Private © 2026 LuxProptyl. All rights reserved.