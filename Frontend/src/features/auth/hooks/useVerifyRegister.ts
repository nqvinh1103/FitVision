import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import * as authApi from "@/features/auth/api/auth.api"
import type { VerifyOtpFormValues } from "@/features/auth/schemas/auth.schema"
import { queryKeys } from "@/lib/api/query-keys"
import { getRoleDashboardPath } from "@/lib/navigation"
import { useAuthStore } from "@/stores/auth.store"

interface VerifyRegisterInput extends VerifyOtpFormValues {
  email: string
  role?: "trainee" | "trainer"
}

export function useVerifyRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: VerifyRegisterInput) =>
      authApi.verifyRegister({
        email: input.email,
        otp: input.otp,
        role: input.role,
      }),
    onSuccess: (data) => {
      setAuth(data.token, data.user)
      queryClient.setQueryData(queryKeys.auth.me, data.user)
      toast.success("Account created successfully!")
      navigate(getRoleDashboardPath(data.user.role), { replace: true })
    },
  })
}
