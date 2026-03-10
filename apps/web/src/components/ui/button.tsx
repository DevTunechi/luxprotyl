import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'gold', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]'

    const variants = {
      gold:    'bg-gradient-to-br from-[var(--gold)] to-[#8A5E18] text-[var(--forest)] shadow-[var(--shadow-gold)] hover:-translate-y-0.5 hover:shadow-lg',
      ghost:   'bg-transparent text-[var(--text-secondary)] border border-[var(--gold-border)] hover:text-[var(--gold)] hover:border-[var(--gold)] hover:bg-[var(--gold-subtle)]',
      danger:  'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
      outline: 'bg-transparent text-[var(--text-primary)] border border-[var(--divider)] hover:border-[var(--gold)] hover:text-[var(--gold)]',
    }

    const sizes = {
      sm: 'text-xs px-3 py-2',
      md: 'text-sm px-5 py-2.5',
      lg: 'text-base px-7 py-3',
    }

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
