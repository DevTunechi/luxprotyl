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
