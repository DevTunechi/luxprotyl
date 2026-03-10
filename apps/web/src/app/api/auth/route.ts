import { NextResponse } from 'next/server'

// Auth is handled directly by Supabase client SDK on the frontend.
// This route exists for future custom auth logic (e.g. post-signup webhooks).
export async function GET() {
  return NextResponse.json({ message: 'Auth is handled by Supabase SDK' })
}
