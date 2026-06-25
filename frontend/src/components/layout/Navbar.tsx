import { NavLink } from 'react-router-dom'
import { Rocket, Globe, BrainCircuit } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Dashboard', icon: Rocket },
  { to: '/country', label: 'Country Explorer', icon: Globe },
  { to: '/prediction', label: 'Mission Success Prediction', icon: BrainCircuit },
]

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-purple-500/20 bg-[#030014]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-14 items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 text-slate-200 font-semibold shrink-0">
            <Rocket className="h-5 w-5 text-purple-400" />
            <span className="hidden sm:inline text-sm">Space Mission Intelligence</span>
          </NavLink>

          <div className="flex items-center gap-1 sm:gap-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-purple-500/10',
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{label}</span>
                <span className="md:hidden">
                  {to === '/' ? 'Dashboard' : to === '/country' ? 'Country' : 'Predict'}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
