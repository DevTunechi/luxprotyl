'use client'
import { useEffect, useState, useCallback } from 'react'

export type Payment = {
  id: string
  tenant_name?: string
  property_name?: string
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'failed'
  due_date: string
  paid_at?: string
  paystack_reference?: string
  created_at: string
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/payments')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setPayments(json.data ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const initializePayment = async (email: string, amount: number, metadata: Record<string, string>) => {
    const res  = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount, metadata }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error)
    return json.data // { authorization_url, reference }
  }

  return { payments, loading, error, refetch: load, initializePayment }
}
