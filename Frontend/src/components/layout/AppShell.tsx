import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { RouteErrorBoundary } from "@/components/common/RouteErrorBoundary"
import { useUiStore } from "@/stores/ui.store"

export function AppShell() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className="flex min-h-screen flex-1 flex-col"
        data-sidebar-open={sidebarOpen}
      >
        <Navbar />
        <main className="flex-1 p-4 md:p-6">
          <RouteErrorBoundary>
            <Outlet />
          </RouteErrorBoundary>
        </main>
      </div>
    </div>
  )
}
