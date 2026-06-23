import { PageHeader } from "@/components/common/PageHeader"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { EmptyState } from "@/components/common/EmptyState"
import { Badge } from "@/components/ui/badge"
import { useTrainerAlerts } from "@/features/trainer/hooks/useTrainer"

export default function TrainerAlertsPage() {
  const { data: alerts, isLoading } = useTrainerAlerts()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Injury Risk Alerts"
        description="Trainees flagged by AI form check — Nhóm Đỏ"
      />
      {isLoading ? <LoadingSpinner /> : null}
      {alerts && alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{alert.traineeName}</p>
                <p className="text-sm text-muted-foreground">
                  {alert.exerciseName} · Form: {alert.formScore}%
                </p>
              </div>
              <Badge variant={alert.riskLevel === "high" ? "destructive" : "secondary"}>
                {alert.riskLevel}
              </Badge>
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <EmptyState title="No alerts" description="All trainees are within safe form ranges." />
      ) : null}
    </div>
  )
}
