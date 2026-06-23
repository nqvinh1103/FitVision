import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import * as paymentApi from "@/features/payment/api/payment.api"
import { queryKeys } from "@/lib/api/query-keys"

export function useCreditPackages() {
  return useQuery({
    queryKey: queryKeys.payment.credits,
    queryFn: paymentApi.getCreditPackages,
  })
}

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.payment.transactions,
    queryFn: paymentApi.getTransactions,
  })
}

export function usePurchaseCredits() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: paymentApi.createPaymentLink,
    onSuccess: (data) => {
      window.open(data.checkoutUrl, "_blank", "noopener,noreferrer")
      toast.success("Redirecting to payment...")
      queryClient.invalidateQueries({ queryKey: queryKeys.payment.transactions })
    },
  })
}
