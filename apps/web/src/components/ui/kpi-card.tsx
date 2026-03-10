import { Card } from './card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'up' | 'down' | 'neutral'
  icon?: string
  className?: string
}

export function KpiCard({ label, value, delta, deltaType = 'neutral', icon, className }: KpiCardProps) {
  const deltaColors = {
    up:      'text-emerald-400',
    down:    'text-red-400',
    neutral: 'text-[var(--text-muted)]',
  }

  return (
    <div
      className={cn('kpi-card', className)}
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      {icon && (
        <span className="absolute right-4 top-4 text-xl opacity-25">{icon}</span>
      )}
      <p className="text-[10px] uppercase tracking-widest mb-2.5 font-semibold" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="font-playfair text-3xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
      {delta && (
        <p className={cn('text-xs mt-2 flex items-center gap-1', deltaColors[deltaType])}>
          {delta}
        </p>
      )}
    </div>
  )
}
