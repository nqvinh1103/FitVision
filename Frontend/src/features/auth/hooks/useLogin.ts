import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import * as authApi from "@/features/auth/api/auth.api"
import type { LoginFormValues } from "@/features/auth/schemas/auth.schema"
import { queryKeys } from "@/lib/api/query-keys"
import { useAuthStore } from "@/stores/auth.store"
import { getRoleDashboardPath } from "@/lib/navigation"

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    onSuccess: (data) => {
      setAuth(data.token, data.user)
      queryClient.setQueryData(queryKeys.auth.me, data.user)
      toast.success("Welcome back!")
      navigate(getRoleDashboardPath(data.user.role), { replace: true })
    },
  })
}
