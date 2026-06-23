import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import * as authApi from "@/features/auth/api/auth.api"
import type { ChangePasswordFormValues } from "@/features/auth/schemas/auth.schema"
import { useAuthStore } from "@/stores/auth.store"

export function useChangePassword() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      logout()
      toast.success("Password changed successfully. Please sign in again.")
      navigate("/login", { replace: true })
    },
  })
}
