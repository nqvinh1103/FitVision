import { mockResponse } from "@/lib/api/mock"
import { mockWorkoutSessions } from "@/lib/api/mock-data"
import type { SubmitSessionPayload, WorkoutSession } from "@/features/workout/types"

export function getWorkoutSessions() {
  return mockResponse(mockWorkoutSessions)
}

export function submitWorkoutSession(payload: SubmitSessionPayload) {
  const session: WorkoutSession = {
    id: Date.now(),
    exerciseName: `Exercise #${payload.exerciseId}`,
    reps: payload.landmarks.length,
    formScore: 90,
    createdAt: new Date().toISOString(),
  }
  return mockResponse(session)
}
