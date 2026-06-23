import type { User } from "@/types/user.types"

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role?: "trainee" | "trainer"
}

export interface VerifyRegisterPayload {
  email: string
  otp: string
  role?: "trainee" | "trainer"
}

export interface ForgotPasswordPayload {
  email: string
}

export interface VerifyForgotPasswordPayload {
  email: string
  otp: string
  newPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface OtpResponse {
  message: string
  expiresIn: number
}

export interface MessageResponse {
  message: string
}
