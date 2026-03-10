#!/bin/bash
# Run from repo ROOT: bash add-api-routes.sh
# Adds Next.js API routes to apps/web — does NOT touch apps/api or any existing files

BASE="apps/web/src/app/api"
mkdir -p $BASE/auth
mkdir -p $BASE/properties
mkdir -p $BASE/leases
mkdir -p $BASE/payments/webhook
mkdir -p $BASE/bookings
mkdir -p $BASE/notices
mkdir -p $BASE/maintenance
mkdir -p $BASE/messages
mkdir -p $BASE/notifications
mkdir -p $BASE/calendar

echo "📁 API directories created"

# ════════════════════════════════
# SHARED SUPABASE HELPER
# ════════════════════════════════
mkdir -p apps/web/src/lib/api
cat > apps/web/src/lib/api/supabase-admin.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

// Service role client — only used in API routes (server-side)
// Never expose SUPABASE_SERVICE_KEY to the browser
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY

  if (!url || !key) {
    throw new Error('Supabase admin credentials not configured')
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
EOF

# ════════════════════════════════
# AUTH ROUTES
# ════════════════════════════════
cat > $BASE/auth/route.ts << 'EOF'
import { NextResponse } from 'next/server'

// Auth is handled directly by Supabase client SDK on the frontend.
// This route exists for future custom auth logic (e.g. post-signup webhooks).
export async function GET() {
  return NextResponse.json({ message: 'Auth is handled by Supabase SDK' })
}
EOF

# ════════════════════════════════
# PROPERTIES
# ════════════════════════════════
cat > $BASE/properties/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/properties — fetch landlord's properties
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/properties — create a new property
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { data, error } = await supabase
      .from('properties')
      .insert({ ...body, landlord_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

# ════════════════════════════════
# LEASES
# ════════════════════════════════
cat > $BASE/leases/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('leases')
      .select('*, properties(name, address)')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { data, error } = await supabase
      .from('leases')
      .insert({ ...body, landlord_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

# ════════════════════════════════
# PAYMENTS
# ════════════════════════════════
cat > $BASE/payments/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('payments')
      .select('*, leases(property_id), properties(name)')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/payments — initialize Paystack transaction
export async function POST(req: NextRequest) {
  try {
    const { email, amount, metadata } = await req.json()

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack uses kobo
        metadata,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments`,
      }),
    })

    const result = await paystackRes.json()
    if (!result.status) throw new Error(result.message)

    return NextResponse.json({ data: result.data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

# ════════════════════════════════
# PAYSTACK WEBHOOK
# ════════════════════════════════
cat > $BASE/payments/webhook/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/api/supabase-admin'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-paystack-signature')
    const secret = process.env.PAYSTACK_SECRET_KEY

    // Verify Paystack signature
    if (!secret || !signature) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex')
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data
      const supabase = createAdminClient()

      // Update payment record to paid
      await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          paystack_reference: reference,
          amount_paid: amount / 100,
        })
        .eq('paystack_reference', reference)

      // If metadata has lease_id, update lease payment status
      if (metadata?.lease_id) {
        await supabase
          .from('leases')
          .update({ last_payment_at: new Date().toISOString() })
          .eq('id', metadata.lease_id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

# ════════════════════════════════
# BOOKINGS
# ════════════════════════════════
cat > $BASE/bookings/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*, properties(name, address)')
      .eq('landlord_id', user.id)
      .order('check_in', { ascending: true })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { data, error } = await supabase
      .from('bookings')
      .insert({ ...body, landlord_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

# ════════════════════════════════
# NOTICES
# ════════════════════════════════
cat > $BASE/notices/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('notices')
      .select('*, properties(name), leases(tenant_id)')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { data, error } = await supabase
      .from('notices')
      .insert({ ...body, landlord_id: user.id, issued_by: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

# ════════════════════════════════
# MAINTENANCE
# ════════════════════════════════
cat > $BASE/maintenance/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('*, properties(name), users(first_name, last_name)')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert({ ...body, tenant_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

# ════════════════════════════════
# MESSAGES
# ════════════════════════════════
cat > $BASE/messages/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const leaseId = req.nextUrl.searchParams.get('lease_id')
    let query = supabase
      .from('messages')
      .select('*, sender:users!sender_id(first_name, last_name)')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: true })

    if (leaseId) query = query.eq('lease_id', leaseId)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { data, error } = await supabase
      .from('messages')
      .insert({ ...body, sender_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

# ════════════════════════════════
# NOTIFICATIONS
# ════════════════════════════════
cat > $BASE/notifications/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// PATCH /api/notifications — mark all as read
export async function PATCH() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

# ════════════════════════════════
# CALENDAR (Airbnb iCal sync)
# ════════════════════════════════
cat > $BASE/calendar/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/api/supabase-admin'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const propertyId = req.nextUrl.searchParams.get('property_id')
    let query = supabase
      .from('calendar_blocks')
      .select('*')
      .order('start_date', { ascending: true })

    if (propertyId) query = query.eq('property_id', propertyId)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/calendar/sync — trigger iCal sync for a property
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { property_id, ical_url } = await req.json()
    if (!property_id || !ical_url) {
      return NextResponse.json({ error: 'property_id and ical_url required' }, { status: 400 })
    }

    // Fetch iCal feed
    const icalRes = await fetch(ical_url)
    if (!icalRes.ok) throw new Error('Failed to fetch iCal feed')
    const icalText = await icalRes.text()

    // Parse VEVENT blocks (lightweight parser — no extra deps)
    const events: { start: string; end: string; summary: string; uid: string }[] = []
    const eventBlocks = icalText.split('BEGIN:VEVENT').slice(1)
    for (const block of eventBlocks) {
      const get = (key: string) => {
        const match = block.match(new RegExp(`${key}[^:]*:([^\r\n]+)`))
        return match ? match[1].trim() : ''
      }
      const dtstart = get('DTSTART')
      const dtend   = get('DTEND')
      const uid     = get('UID')
      const summary = get('SUMMARY')
      if (dtstart && dtend && uid) {
        events.push({
          uid,
          summary,
          start: `${dtstart.slice(0,4)}-${dtstart.slice(4,6)}-${dtstart.slice(6,8)}`,
          end:   `${dtend.slice(0,4)}-${dtend.slice(4,6)}-${dtend.slice(6,8)}`,
        })
      }
    }

    // Upsert blocks into calendar_blocks
    const admin = createAdminClient()
    if (events.length > 0) {
      const rows = events.map(e => ({
        property_id,
        source: 'airbnb',
        external_uid: e.uid,
        summary: e.summary,
        start_date: e.start,
        end_date: e.end,
      }))
      const { error } = await admin
        .from('calendar_blocks')
        .upsert(rows, { onConflict: 'external_uid' })
      if (error) throw error
    }

    // Save ical_url on property
    await admin
      .from('properties')
      .update({ ical_url, last_synced_at: new Date().toISOString() })
      .eq('id', property_id)

    return NextResponse.json({ synced: events.length })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sync error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
EOF

echo ""
echo "════════════════════════════════════════════"
echo "✅ Next.js API routes created:"
echo "   /api/auth"
echo "   /api/properties       GET, POST"
echo "   /api/leases           GET, POST"
echo "   /api/payments         GET, POST (Paystack init)"
echo "   /api/payments/webhook POST (Paystack webhook)"
echo "   /api/bookings         GET, POST"
echo "   /api/notices          GET, POST"
echo "   /api/maintenance      GET, POST"
echo "   /api/messages         GET, POST"
echo "   /api/notifications    GET, PATCH"
echo "   /api/calendar         GET, POST (iCal sync)"
echo ""
echo "   apps/api is untouched ✓"
echo "   All existing files untouched ✓"
echo "════════════════════════════════════════════"