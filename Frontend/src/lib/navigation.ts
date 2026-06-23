import type { UserRole } from "@/types/user.types"

export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case "trainer":
      return "/trainer/dashboard"
    case "admin":
      return "/admin/dashboard"
    default:
      return "/dashboard"
  }
}
