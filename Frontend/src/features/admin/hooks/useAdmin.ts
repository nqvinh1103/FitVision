import { useQuery } from "@tanstack/react-query"
import * as adminApi from "@/features/admin/api/admin.api"
import { queryKeys } from "@/lib/api/query-keys"

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: adminApi.getAdminStats,
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: adminApi.getAdminUsers,
  })
}
