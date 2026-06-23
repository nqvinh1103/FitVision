import { useQuery } from "@tanstack/react-query"
import * as adminApi from "@/features/admin/api/admin.api"
import type { AdminStats } from "@/features/admin/types"
import { queryKeys } from "@/lib/api/query-keys"

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: adminApi.getAdminUsers,
    select: (users): AdminStats => ({
      totalUsers: users.length,
      totalTrainers: users.filter((user) => user.role === "trainer").length,
      totalRevenue: 0,
      activeChallenges: 0,
    }),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: adminApi.getAdminUsers,
  })
}
