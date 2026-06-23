import { useEffect, type ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "@/lib/query-client"
import { useUiStore } from "@/stores/ui.store"

function ThemeSync({ children }: { children: ReactNode }) {
  const theme = useUiStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "dark") {
      root.classList.add("dark")
      return
    }

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.add(prefersDark ? "dark" : "light")
      return
    }

    root.classList.add("light")
  }, [theme])

  return children
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeSync>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </ThemeSync>
      </TooltipProvider>
      {import.meta.env.DEV ? (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      ) : null}
    </QueryClientProvider>
  )
}
