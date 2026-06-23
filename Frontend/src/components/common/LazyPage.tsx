import { Suspense, type ReactNode } from "react"
import { PageLoader } from "@/components/common/LoadingSpinner"

export function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}
