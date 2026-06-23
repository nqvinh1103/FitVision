export interface Challenge {
  id: number
  title: string
  description: string
  rewardCredits: number
  targetReps: number
  deadline: string
  status: "active" | "completed" | "expired"
}

export interface ChallengeSession {
  id: number
  challengeId: number
  repsCompleted: number
  formScore: number
  completedAt: string
}
