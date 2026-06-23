import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import * as authApi from "@/features/auth/api/auth.api"
import type { ResetPasswordFormValues } from "@/features/auth/schemas/auth.schema"

interface VerifyForgotPasswordInput extends ResetPasswordFormValues {
  email: string
}

export function useVerifyForgotPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: VerifyForgotPasswordInput) =>
      authApi.verifyForgotPassword({
        email: input.email,
        otp: input.otp,
        newPassword: input.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password reset successfully. Please sign in with your new password.")
      navigate("/login", { replace: true })
    },
  })
}
