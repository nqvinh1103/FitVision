import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import * as authApi from "@/features/auth/api/auth.api"
import type { RegisterFormValues } from "@/features/auth/schemas/auth.schema"

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      }),
    onSuccess: (_data, values) => {
      toast.success("Verification code sent to your email")
      navigate(`/register/verify?email=${encodeURIComponent(values.email)}`, {
        state: { role: values.role },
      })
    },
  })
}
