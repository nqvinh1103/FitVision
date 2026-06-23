import { FormProvider, useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { Link } from "react-router-dom"

import { FieldGroup } from "@/components/ui/field"

import { FormPasswordField, FormRadioField, FormTextField } from "@/components/common/form-fields"

import { AuthFormShell } from "@/features/auth/components/AuthFormShell"

import {

  registerSchema,

  type RegisterFormValues,

} from "@/features/auth/schemas/auth.schema"

import { useRegister } from "@/features/auth/hooks/useRegister"



const roleOptions = [

  { label: "Trainee", value: "trainee" },

  { label: "Trainer", value: "trainer" },

]



export function RegisterForm() {

  const registerMutation = useRegister()



  const form = useForm<RegisterFormValues>({

    resolver: zodResolver(registerSchema),

    defaultValues: {

      name: "",

      email: "",

      password: "",

      confirmPassword: "",

      role: "trainee",

    },

  })



  return (

    <AuthFormShell

      title="Create account"

      subtitle="Start your fitness journey with 2 free AI credits"

      footer={

        <p className="text-sm text-muted-foreground">

          Already have an account?{" "}

          <Link to="/login" className="font-semibold text-foreground underline-offset-4 hover:text-accent hover:underline">

            Sign in

          </Link>

        </p>

      }

    >

      <FormProvider {...form}>

        <form

          className="space-y-6"

          onSubmit={form.handleSubmit((values) => registerMutation.mutate(values))}

        >

          <FieldGroup className="gap-6">

            <FormTextField

              control={form.control}

              name="name"

              label="Full name"

              placeholder="John Doe"

              autoComplete="name"

              variant="underline"

            />

            <FormTextField

              control={form.control}

              name="email"

              label="Email address"

              type="email"

              placeholder="you@example.com"

              autoComplete="email"

              variant="underline"

            />

            <FormPasswordField
              control={form.control}
              name="password"
              label="Password"
              autoComplete="new-password"
              variant="underline"
            />

            <FormPasswordField
              control={form.control}
              name="confirmPassword"
              label="Confirm password"
              autoComplete="new-password"
              variant="underline"
            />

            <FormRadioField

              control={form.control}

              name="role"

              label="I am a"

              options={roleOptions}

              variant="underline"

            />

          </FieldGroup>



          <button

            type="submit"

            disabled={registerMutation.isPending}

            className="w-full rounded-full bg-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-foreground/90 disabled:opacity-50"

          >

            {registerMutation.isPending ? "Creating account..." : "Create account"}

          </button>

        </form>

      </FormProvider>

    </AuthFormShell>

  )

}


