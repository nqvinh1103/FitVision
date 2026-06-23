import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import * as challengeApi from "@/features/challenge/api/challenge.api"
import { queryKeys } from "@/lib/api/query-keys"

export function useChallenges() {
  return useQuery({
    queryKey: queryKeys.challenges.all,
    queryFn: challengeApi.getChallenges,
  })
}

export function useJoinChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: challengeApi.joinChallenge,
    onSuccess: () => {
      toast.success("Joined challenge!")
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all })
    },
  })
}
