'use client'
import { useEffect, useState, useCallback } from 'react'

export type Property = {
  id: string
  name: string
  address: string
  state: string
  type: 'long_term' | 'short_stay'
  status: 'vacant' | 'occupied'
  monthly_rent?: number
  nightly_rate?: number
  bedrooms?: number
  bathrooms?: number
  invite_token?: string
  ical_url?: string
  created_at: string
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/properties')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setProperties(json.data ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProperties() }, [fetchProperties])

  return { properties, loading, error, refetch: fetchProperties }
}
