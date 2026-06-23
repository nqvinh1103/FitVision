import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldGroup } from "@/components/ui/field"
import { FormTextField } from "@/components/common/form-fields"
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/auth.schema"
import { useChangePassword } from "@/features/auth/hooks/useChangePassword"

export function ChangePasswordForm() {
  const changePassword = useChangePassword()

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  return (
    <div className="mx-auto w-full max-w-lg space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Change password</h1>
        <p className="text-sm text-muted-foreground">
          Update your password. You will be signed out on all devices after saving.
        </p>
      </div>

      <FormProvider {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values) => changePassword.mutate(values))}
        >
          <FieldGroup className="gap-6">
            <FormTextField
              control={form.control}
              name="currentPassword"
              label="Current password"
              type="password"
              autoComplete="current-password"
            />
            <FormTextField
              control={form.control}
              name="newPassword"
              label="New password"
              type="password"
              autoComplete="new-password"
            />
            <FormTextField
              control={form.control}
              name="confirmPassword"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
            />
          </FieldGroup>

          <button
            type="submit"
            disabled={changePassword.isPending}
            className="rounded-full bg-foreground px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-foreground/90 disabled:opacity-50"
          >
            {changePassword.isPending ? "Saving..." : "Save new password"}
          </button>
        </form>
      </FormProvider>
    </div>
  )
}
