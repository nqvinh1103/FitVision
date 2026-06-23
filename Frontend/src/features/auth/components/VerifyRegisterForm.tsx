import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom"
import { FieldGroup } from "@/components/ui/field"
import { FormTextField } from "@/components/common/form-fields"
import { AuthFormShell } from "@/features/auth/components/AuthFormShell"
import { OtpResendButton } from "@/features/auth/components/OtpResendButton"
import { useOtpCooldown } from "@/features/auth/hooks/useOtpCooldown"
import { useResendRegisterOtp } from "@/features/auth/hooks/useResendRegisterOtp"
import { useVerifyRegister } from "@/features/auth/hooks/useVerifyRegister"
import { verifyOtpSchema, type VerifyOtpFormValues } from "@/features/auth/schemas/auth.schema"

interface RegisterVerifyLocationState {
  role?: "trainee" | "trainer"
}

export function VerifyRegisterForm() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const email = searchParams.get("email") ?? ""
  const role = (location.state as RegisterVerifyLocationState | null)?.role

  const verifyRegister = useVerifyRegister()
  const resendOtp = useResendRegisterOtp()
  const { canResend, secondsLeft, resetCooldown } = useOtpCooldown()

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  })

  if (!email) {
    return <Navigate to="/register" replace />
  }

  const handleResend = () => {
    resendOtp.mutate(email, {
      onSuccess: () => resetCooldown(),
    })
  }

  return (
    <AuthFormShell
      title="Verify email"
      subtitle={`Enter the 6-digit code sent to ${email}`}
      footer={
        <p className="text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link
            to="/register"
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
            verifyRegister.mutate({ ...values, email, role }),
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
          </FieldGroup>

          <OtpResendButton
            canResend={canResend}
            secondsLeft={secondsLeft}
            isPending={resendOtp.isPending}
            onResend={handleResend}
          />

          <button
            type="submit"
            disabled={verifyRegister.isPending}
            className="w-full rounded-full bg-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-foreground/90 disabled:opacity-50"
          >
            {verifyRegister.isPending ? "Verifying..." : "Verify & create account"}
          </button>
        </form>
      </FormProvider>
    </AuthFormShell>
  )
}
