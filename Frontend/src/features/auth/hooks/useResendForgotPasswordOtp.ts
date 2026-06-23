import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import * as authApi from "@/features/auth/api/auth.api"

export function useResendForgotPasswordOtp(onResent?: (expiresIn: number) => void) {
  return useMutation({
    mutationFn: (email: string) => authApi.resendForgotPasswordOtp(email),
    onSuccess: (data) => {
      toast.success("Verification code resent")
      onResent?.(data.expiresIn)
    },
  })
}
