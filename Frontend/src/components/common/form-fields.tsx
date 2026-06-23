import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { useState } from "react"
import type { HTMLAttributes, HTMLInputTypeAttribute } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  type?: HTMLInputTypeAttribute
  placeholder?: string
  autoComplete?: string
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"]
  maxLength?: number
  variant?: "default" | "underline"
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  variant = "default",
}: FormTextFieldProps<T>) {
  const isUnderline = variant === "underline"

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel
            htmlFor={field.name}
            className={
              isUnderline
                ? "text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                : undefined
            }
          >
            {label}
          </FieldLabel>
          <FieldContent>
            <Input
              id={field.name}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              inputMode={inputMode}
              maxLength={maxLength}
              aria-invalid={!!fieldState.error}
              className={
                isUnderline
                  ? "h-10 rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 shadow-none focus-visible:border-foreground focus-visible:ring-0 aria-invalid:border-destructive"
                  : undefined
              }
              {...field}
            />
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  )
}

interface FormPasswordFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  autoComplete?: string
  variant?: "default" | "underline"
}

export function FormPasswordField<T extends FieldValues>({
  control,
  name,
  label,
  autoComplete,
  variant = "default",
}: FormPasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false)
  const isUnderline = variant === "underline"

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel
            htmlFor={field.name}
            className={
              isUnderline
                ? "text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                : undefined
            }
          >
            {label}
          </FieldLabel>
          <FieldContent>
            <div className="relative">
              <Input
                id={field.name}
                type={visible ? "text" : "password"}
                autoComplete={autoComplete}
                aria-invalid={!!fieldState.error}
                className={
                  isUnderline
                    ? "h-10 rounded-none border-0 border-b border-foreground/25 bg-transparent px-0 pr-8 shadow-none focus-visible:border-foreground focus-visible:ring-0 aria-invalid:border-destructive"
                    : "pr-9"
                }
                {...field}
              />
              <button
                type="button"
                onClick={() => setVisible((current) => !current)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  )
}

interface SelectOption {
  label: string
  value: string
}

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  options: SelectOption[]
}

export function FormSelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
}: FormSelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <FieldContent>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={field.name} className="w-full" aria-invalid={!!fieldState.error}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  )
}

interface FormRadioFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  options: SelectOption[]
  variant?: "default" | "underline"
}

export function FormRadioField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  variant = "default",
}: FormRadioFieldProps<T>) {
  const isUnderline = variant === "underline"

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel
            className={
              isUnderline
                ? "text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                : undefined
            }
          >
            {label}
          </FieldLabel>
          <FieldContent>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-4"
              aria-invalid={!!fieldState.error}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                  <Label htmlFor={`${field.name}-${option.value}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <FieldError errors={[fieldState.error]} />
          </FieldContent>
        </Field>
      )}
    />
  )
}
