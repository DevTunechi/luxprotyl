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
