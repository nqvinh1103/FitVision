import type { ReactNode } from "react"
import { AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorFallbackProps {
  title?: string
  message?: string
  onRetry?: () => void
  action?: ReactNode
}

export function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  action,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangleIcon className="size-6" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {action ?? (onRetry ? <Button onClick={onRetry}>Try again</Button> : null)}
    </div>
  )
}
