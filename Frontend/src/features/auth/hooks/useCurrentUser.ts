import { useQuery } from "@tanstack/react-query"
import * as authApi from "@/features/auth/api/auth.api"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { queryKeys } from "@/lib/api/query-keys"
import { useAuthStore } from "@/stores/auth.store"

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const logout = useLogout()

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const user = await authApi.getMe()
      if (token) {
        setAuth(token, user)
      }
      return user
    },
    enabled: Boolean(token),
    retry: false,
    meta: {
      onUnauthorized: () => logout(),
    },
  })
}
