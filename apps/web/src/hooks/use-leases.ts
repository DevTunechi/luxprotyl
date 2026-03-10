'use client'
import { useEffect, useState, useCallback } from 'react'

export type Lease = {
  id: string
  property_id: string
  tenant_id?: string
  landlord_id: string
  start_date: string
  end_date: string
  monthly_rent: number
  status: 'active' | 'expired' | 'terminated' | 'pending'
  invite_token?: string
  tenant_name?: string
  property_name?: string
  days_until_expiry?: number
  created_at: string
}

export function useLeases() {
  const [leases, setLeases]   = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/leases')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setLeases(json.data ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load leases')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { leases, loading, error, refetch: load }
}
