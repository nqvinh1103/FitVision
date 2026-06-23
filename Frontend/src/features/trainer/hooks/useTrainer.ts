import { useQuery } from "@tanstack/react-query"
import * as trainerApi from "@/features/trainer/api/trainer.api"
import { queryKeys } from "@/lib/api/query-keys"

export function useTrainerDashboard() {
  return useQuery({
    queryKey: queryKeys.trainer.dashboard,
    queryFn: trainerApi.getTrainerDashboard,
  })
}

export function useTrainerAlerts() {
  return useQuery({
    queryKey: queryKeys.trainer.alerts,
    queryFn: trainerApi.getTrainerAlerts,
  })
}

export function useTrainerPrograms() {
  return useQuery({
    queryKey: queryKeys.trainer.trainees,
    queryFn: trainerApi.getTrainerPrograms,
  })
}
