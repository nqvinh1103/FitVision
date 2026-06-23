import { PageHeader } from "@/components/common/PageHeader"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { EmptyState } from "@/components/common/EmptyState"
import { Badge } from "@/components/ui/badge"
import { useTrainerPrograms } from "@/features/trainer/hooks/useTrainer"

export default function TrainerProgramsPage() {
  const { data: programs, isLoading } = useTrainerPrograms()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Programs"
        description="AI-generated programs for your trainees and marketplace"
      />
      {isLoading ? <LoadingSpinner /> : null}
      {programs && programs.length > 0 ? (
        <div className="space-y-3">
          {programs.map((program) => (
            <div
              key={program.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{program.title}</p>
                <p className="text-sm text-muted-foreground">
                  {program.price.toLocaleString()}đ
                </p>
              </div>
              <Badge variant={program.status === "published" ? "default" : "secondary"}>
                {program.status}
              </Badge>
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <EmptyState
          title="No programs yet"
          description="Use the AI Program Builder to create your first training plan."
        />
      ) : null}
    </div>
  )
}
