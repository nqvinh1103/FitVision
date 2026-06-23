import { Outlet } from "react-router-dom"
import { LandingHeader } from "@/components/layout/LandingHeader"
import { RouteErrorBoundary } from "@/components/common/RouteErrorBoundary"

export function LandingLayout() {
  return (
    <div className="landing min-h-screen bg-white font-sans antialiased">
      <LandingHeader />
      <RouteErrorBoundary>
        <Outlet />
      </RouteErrorBoundary>
    </div>
  )
}
