import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { FieldGroup } from "@/components/ui/field"
import { FormPasswordField, FormTextField } from "@/components/common/form-fields"
import { AuthFormShell } from "@/features/auth/components/AuthFormShell"
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schema"
import { useLogin } from "@/features/auth/hooks/useLogin"

export function LoginForm() {
  const login = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <AuthFormShell
      title="Please log in"
      subtitle="Enter your credentials to access your account"
      footer={
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-foreground underline-offset-4 hover:text-accent hover:underline">
            Sign up
          </Link>
        </p>
      }
    >
      <FormProvider {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values) => login.mutate(values))}
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
            <div className="space-y-2">
              <FormPasswordField
                control={form.control}
                name="password"
                label="Password"
                autoComplete="current-password"
                variant="underline"
              />
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </FieldGroup>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-full bg-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-foreground/90 disabled:opacity-50"
          >
            {login.isPending ? "Signing in..." : "Login"}
          </button>
        </form>
      </FormProvider>
    </AuthFormShell>
  )
}

