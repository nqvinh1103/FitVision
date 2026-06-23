import { useQuery } from "@tanstack/react-query"
import * as workoutApi from "@/features/workout/api/workout.api"
import { queryKeys } from "@/lib/api/query-keys"

export function useWorkoutSessions() {
  return useQuery({
    queryKey: queryKeys.workouts.sessions,
    queryFn: workoutApi.getWorkoutSessions,
  })
}
