import { cn } from '@/lib/utils'

type PillVariant = 'paid' | 'due' | 'overdue' | 'active' | 'expired' | 'vacant' | 'occupied' | 'airbnb' | 'pending'

const variants: Record<PillVariant, string> = {
  paid:     'bg-emerald-500/15 text-emerald-400',
  due:      'bg-yellow-500/15 text-yellow-400',
  overdue:  'bg-red-500/15 text-red-400',
  active:   'bg-emerald-500/15 text-emerald-400',
  expired:  'bg-red-500/15 text-red-400',
  vacant:   'bg-red-500/15 text-red-400',
  occupied: 'bg-emerald-500/15 text-emerald-400',
  airbnb:   'bg-orange-500/15 text-orange-400',
  pending:  'bg-yellow-500/15 text-yellow-400',
}

export function StatusPill({ status, className }: { status: PillVariant; className?: string }) {
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold capitalize', variants[status], className)}>
      {status}
    </span>
  )
}
