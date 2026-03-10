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
