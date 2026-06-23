import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import * as marketplaceApi from "@/features/marketplace/api/marketplace.api"
import type { CreateProgramPayload } from "@/features/marketplace/types"
import { queryKeys } from "@/lib/api/query-keys"

export function useMarketplacePrograms() {
  return useQuery({
    queryKey: queryKeys.marketplace.programs,
    queryFn: marketplaceApi.getMarketplacePrograms,
  })
}

export function useCreateProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProgramPayload) =>
      marketplaceApi.createProgramWithAi(payload),
    onSuccess: () => {
      toast.success("Program generated! Review before publishing.")
      queryClient.invalidateQueries({ queryKey: queryKeys.marketplace.programs })
    },
  })
}

export function usePurchaseProgram() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: marketplaceApi.purchaseProgram,
    onSuccess: () => {
      toast.success("Program purchased!")
      queryClient.invalidateQueries({ queryKey: queryKeys.marketplace.programs })
    },
  })
}
