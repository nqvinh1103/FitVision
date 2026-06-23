import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import * as authApi from "@/features/auth/api/auth.api"
import type { ForgotPasswordFormValues } from "@/features/auth/schemas/auth.schema"

export function useForgotPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (values: ForgotPasswordFormValues) => authApi.forgotPassword(values),
    onSuccess: (_data, values) => {
      toast.success("If the email exists, a verification code has been sent")
      navigate(`/forgot-password/reset?email=${encodeURIComponent(values.email)}`)
    },
  })
}
