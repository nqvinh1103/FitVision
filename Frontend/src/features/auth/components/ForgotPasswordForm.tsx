import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { FieldGroup } from "@/components/ui/field"
import { FormTextField } from "@/components/common/form-fields"
import { AuthFormShell } from "@/features/auth/components/AuthFormShell"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth.schema"
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword"

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  return (
    <AuthFormShell
      title="Forgot password"
      subtitle="Enter your email and we'll send you a verification code"
      footer={
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-foreground underline-offset-4 hover:text-accent hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <FormProvider {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values) => forgotPassword.mutate(values))}
        >
          <FieldGroup className="gap-6">
            <FormTextField
              control={form.control}
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              variant="underline"
            />
          </FieldGroup>

          <button
            type="submit"
            disabled={forgotPassword.isPending}
            className="w-full rounded-full bg-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-foreground/90 disabled:opacity-50"
          >
            {forgotPassword.isPending ? "Sending code..." : "Send verification code"}
          </button>
        </form>
      </FormProvider>
    </AuthFormShell>
  )
}
