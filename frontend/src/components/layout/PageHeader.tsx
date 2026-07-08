import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  description?: string
}

export function PageHeader({ icon: Icon, title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-8 w-8 text-purple-400 shrink-0" />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-100">{title}</h1>
      </div>
      {description && <p className="text-slate-400 max-w-3xl">{description}</p>}
    </div>
  )
}
