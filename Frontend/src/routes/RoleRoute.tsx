import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/stores/auth.store"
import type { UserRole } from "@/types/user.types"

interface RoleRouteProps {
  allowedRoles: UserRole[]
  redirectTo?: string
}

export function RoleRoute({ allowedRoles, redirectTo = "/unauthorized" }: RoleRouteProps) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
