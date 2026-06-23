import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { ErrorFallback } from "@/components/common/ErrorFallback"
import { WorkoutCamera } from "@/features/workout/components/WorkoutCamera"
import { useWorkoutSessions } from "@/features/workout/hooks/useWorkoutSessions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WorkoutPage() {
  const { data: sessions, isLoading, isError, refetch } = useWorkoutSessions()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workout"
        description="AI-powered form check with edge pose detection"
      />

      <WorkoutCamera />

      <section className="space-y-4">
        <h2 className="font-medium">Recent sessions</h2>
        {isLoading ? <LoadingSpinner /> : null}
        {isError ? <ErrorFallback onRetry={() => refetch()} /> : null}
        {!isLoading && !isError && sessions?.length === 0 ? (
          <EmptyState
            title="No sessions yet"
            description="Complete your first AI form check to see results here."
          />
        ) : null}
        {!isLoading && !isError && sessions && sessions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle>{session.exerciseName}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Reps: {session.reps}</p>
                  <p>Form score: {session.formScore}%</p>
                  <p>{new Date(session.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
