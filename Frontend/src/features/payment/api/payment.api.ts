import { apiClient } from "@/lib/api/client"
import type {
  CreatePaymentPayload,
  CreditPackage,
  PaymentLinkResponse,
  Transaction,
} from "@/features/payment/types"

export function getCreditPackages() {
  return apiClient<CreditPackage[]>("/payments/packages", { auth: false })
}

export function getTransactions() {
  return apiClient<Transaction[]>("/payments/transactions")
}

export function createPaymentLink(payload: CreatePaymentPayload) {
  return apiClient<PaymentLinkResponse>("/payments/checkout", {
    method: "POST",
    body: payload,
  })
}
