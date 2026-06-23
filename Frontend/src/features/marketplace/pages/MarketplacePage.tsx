import { ShoppingBagIcon, StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/PageHeader"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { EmptyState } from "@/components/common/EmptyState"
import {
  useMarketplacePrograms,
  usePurchaseProgram,
} from "@/features/marketplace/hooks/useMarketplace"

export default function MarketplacePage() {
  const { data: programs, isLoading } = useMarketplacePrograms()
  const purchase = usePurchaseProgram()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace"
        description="Browse premium training programs from certified trainers"
      />
      {isLoading ? <LoadingSpinner /> : null}
      {programs && programs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div key={program.id} className="rounded-xl border p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="size-5 text-primary" />
                <h3 className="font-medium">{program.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {program.description}
              </p>
              <p className="text-xs text-muted-foreground">by {program.trainerName}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <StarIcon className="size-4 fill-primary text-primary" />
                  {program.rating}
                  <span className="text-muted-foreground">
                    · {program.exerciseCount} exercises
                  </span>
                </div>
                <span className="font-medium">{program.price.toLocaleString()}đ</span>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => purchase.mutate(program.id)}
                disabled={purchase.isPending}
              >
                Purchase
              </Button>
            </div>
          ))}
        </div>
      ) : !isLoading ? (
        <EmptyState
          title="No programs available"
          description="Trainers haven't published any programs yet."
        />
      ) : null}
    </div>
  )
}
