import { motion } from 'framer-motion'
import {
  Activity,
  CheckCircle2,
  DollarSign,
  Globe,
  Rocket,
  Satellite,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { HeroSection } from '@/components/Hero'
import { KPICard, KPICardsSkeleton } from '@/components/KPICards'
import { SuccessGauge, SuccessGaugeSkeleton } from '@/components/SuccessGauge'
import { ErrorState } from '@/components/StateMessages'
import { YearlyTrendChart } from '@/charts/YearlyTrendChart'
import { StatusDonutChart } from '@/charts/StatusDonutChart'
import { MissionCategoryChart } from '@/charts/MissionCategoryChart'
import { AgencyTable } from '@/charts/AgencyTable'
import { useDashboard } from '@/hooks/useDashboard'

export function Dashboard() {
  const {
    overview,
    yearlyTrend,
    statusDistribution,
    missionCategory,
    agencies,
    loading,
    error,
    refetch,
  } = useDashboard()

  if (error && !overview) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pb-16 max-w-7xl">
      <HeroSection />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="section-title">Key Metrics</h2>
        {loading ? (
          <KPICardsSkeleton />
        ) : overview ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard label="Total Missions" value={overview.total_missions} icon={Rocket} index={0} />
            <KPICard label="Success Rate" value={overview.success_percentage.toFixed(1)} icon={TrendingUp} index={1} suffix="%" />
            <KPICard label="Average Cost" value={`$${overview.avg_cost}`} icon={DollarSign} index={2} suffix="M" />
            <KPICard label="Countries" value={overview.total_countries} icon={Globe} index={3} />
            <KPICard label="Launch Vehicles" value={overview.launch_vehicles} icon={Satellite} index={4} />
            <KPICard label="Upcoming" value={overview.upcoming_missions} icon={Calendar} index={5} />
            <KPICard label="Ongoing" value={overview.ongoing_missions} icon={Activity} index={6} />
            <KPICard label="Completed" value={overview.missions_completed} icon={CheckCircle2} index={7} />
          </div>
        ) : null}
      </motion.section>

      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {loading ? <SuccessGaugeSkeleton /> : overview ? <SuccessGauge percentage={overview.success_percentage} /> : null}
          <div className="lg:col-span-2">
            <YearlyTrendChart data={yearlyTrend} loading={loading} />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusDonutChart data={statusDistribution} loading={loading} />
          <MissionCategoryChart data={missionCategory} loading={loading} />
        </div>
      </section>

      <section className="mb-12">
        <AgencyTable data={agencies} loading={loading} />
      </section>
    </div>
  )
}
