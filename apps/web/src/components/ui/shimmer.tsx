import { cn } from '@/lib/utils'

export function Shimmer({ className }: { className?: string }) {
  return <div className={cn('shimmer rounded-md', className)} />
}

export function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Shimmer key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-3">
          <Shimmer className="h-8 w-40" />
          {[...Array(5)].map((_, i) => (
            <Shimmer key={i} className="h-14 rounded-lg" />
          ))}
        </div>
        <div className="space-y-3">
          <Shimmer className="h-8 w-32" />
          {[...Array(4)].map((_, i) => (
            <Shimmer key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
