import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { ErrorFallback } from "@/components/common/ErrorFallback"
import { AiSafetyRadar } from "@/features/trainer/components/AiSafetyRadar"
import { QuickAiBuilder } from "@/features/trainer/components/QuickAiBuilder"
import { RevenueCapacityPanel } from "@/features/trainer/components/RevenueCapacityPanel"
import { useTrainerAlerts, useTrainerDashboard } from "@/features/trainer/hooks/useTrainer"

export default function TrainerDashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useTrainerDashboard()
  const { data: alerts = [] } = useTrainerAlerts()

  if (isLoading) return <LoadingSpinner />
  if (isError || !stats) return <ErrorFallback onRetry={() => refetch()} />

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-5xl leading-none uppercase md:text-6xl">
          Command Center
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Real-time trainer telemetry &amp; AI safety oversight.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-4">
        <AiSafetyRadar alerts={alerts} />
        <RevenueCapacityPanel stats={stats} />
        <QuickAiBuilder />
      </div>
    </div>
  )
}
