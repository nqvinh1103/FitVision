import { WalletIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/common/PageHeader"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { EmptyState } from "@/components/common/EmptyState"
import {
  useCreditPackages,
  usePurchaseCredits,
  useTransactions,
} from "@/features/payment/hooks/usePayment"

export default function PaymentPage() {
  const { data: packages, isLoading: packagesLoading } = useCreditPackages()
  const { data: transactions, isLoading: txLoading } = useTransactions()
  const purchase = usePurchaseCredits()

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Credits"
        description="Purchase credits via payOS to unlock AI form checks"
      />

      <section className="space-y-4">
        <h2 className="font-medium">Credit packages</h2>
        {packagesLoading ? <LoadingSpinner /> : null}
        {packages && packages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-2xl font-semibold">
                    {pkg.credits} credits · {pkg.price.toLocaleString()}đ
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => purchase.mutate({ packageId: pkg.id })}
                    disabled={purchase.isPending}
                  >
                    <WalletIcon className="size-4" />
                    Buy now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !packagesLoading ? (
          <EmptyState
            title="No packages available"
            description="Credit packages will appear here once configured."
          />
        ) : null}
      </section>

      <section className="space-y-4">
        <h2 className="font-medium">Transaction history</h2>
        {txLoading ? <LoadingSpinner /> : null}
        {transactions && transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{tx.credits} credits</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge
                  variant={
                    tx.status === "completed"
                      ? "default"
                      : tx.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {tx.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : !txLoading ? (
          <EmptyState title="No transactions" description="Your payment history will show here." />
        ) : null}
      </section>
    </div>
  )
}
