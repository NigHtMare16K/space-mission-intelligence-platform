import { NavLink } from 'react-router-dom'
import {
  Rocket,
  Globe,
  BrainCircuit,
  Search,
  Sparkles,
  GitCompare,
  Bot,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Dashboard', icon: Rocket, short: 'Home' },
  { to: '/country', label: 'Country Statistics', icon: Globe, short: 'Country' },
  { to: '/search', label: 'Mission Search', icon: Search, short: 'Search' },
  { to: '/recommend', label: 'Recommendation', icon: Sparkles, short: 'Recommend' },
  { to: '/compare', label: 'Comparison', icon: GitCompare, short: 'Compare' },
  { to: '/prediction', label: 'Success Prediction', icon: BrainCircuit, short: 'Predict' },
  { to: '/chat', label: 'AI Chatbot', icon: Bot, short: 'Chat' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-purple-500/20 bg-[#030014]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-14 items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 text-slate-200 font-semibold shrink-0">
            <Rocket className="h-5 w-5 text-purple-400" />
            <span className="hidden sm:inline text-sm">Space Mission Intelligence</span>
          </NavLink>

          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-purple-500/10',
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-slate-400 hover:text-slate-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-3 grid grid-cols-2 gap-1">
            {links.map(({ to, icon: Icon, short }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-purple-500/10',
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {short}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
