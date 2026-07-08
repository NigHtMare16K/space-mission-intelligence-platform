import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'inline'
  message?: string
  className?: string
  rows?: number
}

export function LoadingState({
  variant = 'spinner',
  message = 'Loading...',
  className,
  rows = 3,
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-slate-400', className)}>
        <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
        {message}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <Loader2 className="h-10 w-10 animate-spin text-purple-400 mb-4" />
      <p className="text-slate-400">{message}</p>
    </div>
  )
}
