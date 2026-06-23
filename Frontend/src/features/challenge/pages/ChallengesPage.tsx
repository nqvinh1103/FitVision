import { TrophyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/common/PageHeader"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { EmptyState } from "@/components/common/EmptyState"
import { useChallenges, useJoinChallenge } from "@/features/challenge/hooks/useChallenges"

export default function ChallengesPage() {
  const { data: challenges, isLoading } = useChallenges()
  const join = useJoinChallenge()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Challenges"
        description="Complete mini-challenges to earn AI credits"
      />
      {isLoading ? <LoadingSpinner /> : null}
      {challenges && challenges.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="rounded-xl border p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="size-5 text-primary" />
                  <h3 className="font-medium">{challenge.title}</h3>
                </div>
                <Badge>{challenge.rewardCredits} credits</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
              <p className="text-xs text-muted-foreground">
                Target: {challenge.targetReps} reps · Deadline:{" "}
                {new Date(challenge.deadline).toLocaleDateString()}
              </p>
              {challenge.status === "active" ? (
                <Button
                  size="sm"
                  onClick={() => join.mutate(challenge.id)}
                  disabled={join.isPending}
                >
                  Join challenge
                </Button>
              ) : (
                <Badge variant="secondary">{challenge.status}</Badge>
              )}
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <EmptyState
          title="No active challenges"
          description="Check back soon for new challenges to earn credits."
        />
      ) : null}
    </div>
  )
}
