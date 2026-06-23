import { Link } from "react-router-dom"
import {
  ActivityIcon,
  MailIcon,
  UserXIcon,
  VideoIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TrainerAlert } from "@/features/trainer/types"
import { cn } from "@/lib/utils"

interface AiSafetyRadarProps {
  alerts: TrainerAlert[]
}

function AlertSeverityBadge({
  level,
}: {
  level: TrainerAlert["riskLevel"] | "inactive"
}) {
  if (level === "high") {
    return (
      <span className="bg-accent px-2 py-1 text-xs font-bold tracking-widest text-accent-foreground uppercase">
        Critical
      </span>
    )
  }
  if (level === "inactive") {
    return (
      <span className="bg-amber-500 px-2 py-1 text-xs font-bold tracking-widest text-black uppercase">
        Warning
      </span>
    )
  }
  return (
    <span className="bg-muted px-2 py-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
      {level}
    </span>
  )
}

export function AiSafetyRadar({ alerts }: AiSafetyRadarProps) {
  const criticalCount = alerts.filter((a) => a.riskLevel === "high").length

  return (
    <section className="col-span-12 flex flex-col border border-border/40 bg-card p-6 lg:col-span-8">
      <div className="mb-6 flex items-end justify-between border-b border-border pb-2">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-2xl uppercase">
            <ActivityIcon className="size-5 animate-pulse text-accent" />
            AI Safety Radar
          </h2>
          {criticalCount > 0 ? (
            <span className="mt-1 block text-xs font-bold tracking-widest text-accent uppercase">
              {criticalCount} critical alert{criticalCount !== 1 ? "s" : ""} detected
            </span>
          ) : (
            <span className="mt-1 block text-xs font-bold tracking-widest text-muted-foreground uppercase">
              All systems nominal
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" className="rounded-none text-xs tracking-widest uppercase" asChild>
          <Link to="/trainer/alerts">View all logs</Link>
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {alerts.length === 0 ? (
          <div className="border border-dashed border-border/60 bg-muted/30 p-8 text-center">
            <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              No active safety alerts
            </p>
          </div>
        ) : (
          alerts.slice(0, 4).map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "group flex items-center justify-between border-l-4 bg-background p-4 transition-colors hover:bg-muted/40",
                alert.riskLevel === "high" ? "border-accent" : "border-amber-500",
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center bg-muted">
                  <UserXIcon className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-xs font-bold tracking-widest uppercase">
                    {alert.traineeName}: {alert.exerciseName}
                  </div>
                  <div
                    className={cn(
                      "mt-1 font-mono text-sm",
                      alert.riskLevel === "high" ? "text-accent" : "text-amber-500",
                    )}
                  >
                    Form score: {alert.formScore}% · Risk: {alert.riskLevel}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertSeverityBadge level={alert.riskLevel} />
                <Button variant="ghost" size="icon-sm" aria-label="Review session">
                  {alert.riskLevel === "high" ? <VideoIcon /> : <MailIcon />}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
