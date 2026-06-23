export interface Transaction {
  id: number
  amount: number
  credits: number
  status: "pending" | "completed" | "failed"
  createdAt: string
}

export interface CreditPackage {
  id: number
  name: string
  credits: number
  price: number
}

export interface CreatePaymentPayload {
  packageId: number
}

export interface PaymentLinkResponse {
  checkoutUrl: string
  orderCode: string
}
