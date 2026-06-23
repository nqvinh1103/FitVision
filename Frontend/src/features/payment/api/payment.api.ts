import { mockResponse } from "@/lib/api/mock"
import { mockCreditPackages, mockTransactions } from "@/lib/api/mock-data"
import type { CreatePaymentPayload, PaymentLinkResponse } from "@/features/payment/types"

export function getCreditPackages() {
  return mockResponse(mockCreditPackages)
}

export function getTransactions() {
  return mockResponse(mockTransactions)
}

export function createPaymentLink(_payload: CreatePaymentPayload) {
  return mockResponse<PaymentLinkResponse>({
    checkoutUrl: "https://example.com/checkout/mock",
    orderCode: "MOCK-ORDER-001",
  })
}
