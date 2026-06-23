import { apiClient } from "@/lib/api/client"
import { mapAuthResponse, mapUserResponse } from "@/features/auth/api/auth.mapper"
import type {
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  MessageResponse,
  OtpResponse,
  RegisterPayload,
  VerifyForgotPasswordPayload,
  VerifyRegisterPayload,
} from "@/features/auth/types"

export async function login(payload: LoginPayload) {
  const response = await apiClient<{ accessToken: string; user: Parameters<typeof mapUserResponse>[0] }>(
    "/auth/login",
    {
      method: "POST",
      body: payload,
      auth: false,
    },
  )

  return mapAuthResponse(response)
}

export function register(payload: RegisterPayload) {
  return apiClient<OtpResponse>("/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  })
}

export async function verifyRegister(payload: VerifyRegisterPayload): Promise<AuthResponse> {
  const response = await apiClient<{ accessToken: string; user: Parameters<typeof mapUserResponse>[0] }>(
    "/auth/register/verify",
    {
      method: "POST",
      body: payload,
      auth: false,
    },
  )

  return mapAuthResponse(response)
}

export function resendRegisterOtp(email: string) {
  return apiClient<OtpResponse>("/auth/register/resend-otp", {
    method: "POST",
    body: { email },
    auth: false,
  })
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<OtpResponse>("/auth/forgot-password", {
    method: "POST",
    body: payload,
    auth: false,
  })
}

export function verifyForgotPassword(payload: VerifyForgotPasswordPayload) {
  return apiClient<MessageResponse>("/auth/forgot-password/verify", {
    method: "POST",
    body: payload,
    auth: false,
  })
}

export function resendForgotPasswordOtp(email: string) {
  return apiClient<OtpResponse>("/auth/forgot-password/resend-otp", {
    method: "POST",
    body: { email },
    auth: false,
  })
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiClient<MessageResponse>("/auth/change-password", {
    method: "POST",
    body: payload,
  })
}

export async function getMe() {
  const response = await apiClient<Parameters<typeof mapUserResponse>[0]>("/auth/me")
  return mapUserResponse(response)
}
