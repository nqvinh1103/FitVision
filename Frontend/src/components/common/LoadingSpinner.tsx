import type { ReactNode } from "react"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  label?: string
}

export function LoadingSpinner({ className, label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center gap-3 text-muted-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2Icon className="size-8 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner label="Loading page..." />
    </div>
  )
}

interface SuspenseFallbackProps {
  children?: ReactNode
}

export function SuspenseFallback({ children }: SuspenseFallbackProps) {
  return children ?? <PageLoader />
}
