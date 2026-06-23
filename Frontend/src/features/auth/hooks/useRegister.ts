import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import * as authApi from "@/features/auth/api/auth.api"
import type { RegisterFormValues } from "@/features/auth/schemas/auth.schema"
import { queryKeys } from "@/lib/api/query-keys"
import { useAuthStore } from "@/stores/auth.store"
import { getRoleDashboardPath } from "@/lib/navigation"

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      }),
    onSuccess: (data) => {
      setAuth(data.token, data.user)
      queryClient.setQueryData(queryKeys.auth.me, data.user)
      toast.success("Account created successfully!")
      navigate(getRoleDashboardPath(data.user.role))
    },
  })
}
