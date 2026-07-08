import { Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { StarsBackground } from '@/components/Hero'
import { Navbar } from '@/components/layout/Navbar'
import { PageTransition } from '@/components/layout/PageTransition'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-space-black relative">
      <StarsBackground />
      <div className="relative z-10">
        <Navbar />
        <AnimatePresence mode="wait">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
        <footer className="border-t border-purple-500/10 py-6 text-center text-sm text-slate-500">
          Space Mission Intelligence Platform &mdash; Powered by FastAPI &amp; React
        </footer>
      </div>
    </div>
  )
}
