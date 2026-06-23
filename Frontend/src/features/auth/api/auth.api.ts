import { apiClient } from "@/lib/api/client"
import { mapAuthResponse, mapUserResponse } from "@/features/auth/api/auth.mapper"
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/features/auth/types"
import type { User } from "@/types/user.types"

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
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  })
}

export async function getMe() {
  const response = await apiClient<Parameters<typeof mapUserResponse>[0]>("/auth/me")
  return mapUserResponse(response)
}
