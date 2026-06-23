import { TrendingUpIcon, WalletIcon } from "lucide-react"
import type { TrainerDashboardStats } from "@/features/trainer/types"

interface RevenueCapacityPanelProps {
  stats: TrainerDashboardStats
}

export function RevenueCapacityPanel({ stats }: RevenueCapacityPanelProps) {
  const capacityMax = 50
  const capacityUsed = stats.totalTrainees
  const capacityPercent = Math.min(100, Math.round((capacityUsed / capacityMax) * 100))
  const estimatedRevenue = capacityUsed * 320
  const isNearCapacity = capacityPercent >= 85

  return (
    <section className="col-span-12 flex flex-col border border-border/40 bg-card p-6 lg:col-span-4">
      <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-2 font-heading text-2xl uppercase">
        <WalletIcon className="size-5 text-muted-foreground" />
        Revenue &amp; Capacity
      </h2>

      <div className="mb-6">
        <div className="mb-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Estimated earnings (MTD)
        </div>
        <div className="font-heading text-6xl leading-none text-emerald-500">
          ${estimatedRevenue.toLocaleString()}
        </div>
        <div className="mt-2 flex items-center gap-1 font-mono text-sm text-muted-foreground">
          <TrendingUpIcon className="size-4 text-emerald-500" />
          Based on {stats.sessionsToday} sessions today
        </div>
      </div>

      <div className="mt-auto">
        <div className="mb-2 flex items-end justify-between">
          <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Student capacity
          </div>
          <div className="font-mono text-sm">
            {capacityUsed} / {capacityMax}
          </div>
        </div>
        <div className="h-2 w-full bg-muted">
          <div
            className="h-full bg-foreground transition-all"
            style={{ width: `${capacityPercent}%` }}
          />
        </div>
        {isNearCapacity ? (
          <div className="mt-2 text-right text-xs font-bold tracking-widest text-amber-500 uppercase">
            Near capacity
          </div>
        ) : null}
      </div>
    </section>
  )
}
