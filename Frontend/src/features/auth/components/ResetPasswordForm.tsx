import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useSearchParams } from "react-router-dom"
import { FieldGroup } from "@/components/ui/field"
import { FormTextField } from "@/components/common/form-fields"
import { AuthFormShell } from "@/features/auth/components/AuthFormShell"
import { OtpResendButton } from "@/features/auth/components/OtpResendButton"
import { useOtpCooldown } from "@/features/auth/hooks/useOtpCooldown"
import { useResendForgotPasswordOtp } from "@/features/auth/hooks/useResendForgotPasswordOtp"
import { useVerifyForgotPassword } from "@/features/auth/hooks/useVerifyForgotPassword"
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schema"

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") ?? ""

  const verifyForgotPassword = useVerifyForgotPassword()
  const resendOtp = useResendForgotPasswordOtp()
  const { canResend, secondsLeft, resetCooldown } = useOtpCooldown()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  if (!email) {
    return <Navigate to="/forgot-password" replace />
  }

  const handleResend = () => {
    resendOtp.mutate(email, {
      onSuccess: () => resetCooldown(),
    })
  }

  return (
    <AuthFormShell
      title="Reset password"
      subtitle={`Enter the code sent to ${email} and choose a new password`}
      footer={
        <p className="text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link
            to="/forgot-password"
            className="font-semibold text-foreground underline-offset-4 hover:text-accent hover:underline"
          >
            Go back
          </Link>
        </p>
      }
    >
      <FormProvider {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values) =>
            verifyForgotPassword.mutate({ ...values, email }),
          )}
        >
          <FieldGroup className="gap-6">
            <FormTextField
              control={form.control}
              name="otp"
              label="Verification code"
              placeholder="000000"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              variant="underline"
            />
            <FormTextField
              control={form.control}
              name="newPassword"
              label="New password"
              type="password"
              autoComplete="new-password"
              variant="underline"
            />
            <FormTextField
              control={form.control}
              name="confirmPassword"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              variant="underline"
            />
          </FieldGroup>

          <OtpResendButton
            canResend={canResend}
            secondsLeft={secondsLeft}
            isPending={resendOtp.isPending}
            onResend={handleResend}
          />

          <button
            type="submit"
            disabled={verifyForgotPassword.isPending}
            className="w-full rounded-full bg-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-foreground/90 disabled:opacity-50"
          >
            {verifyForgotPassword.isPending ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </FormProvider>
    </AuthFormShell>
  )
}
