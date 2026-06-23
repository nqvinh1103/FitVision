import { apiClient } from "@/lib/api/client"
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/features/auth/types"
import type { User } from "@/types/user.types"

export function login(payload: LoginPayload) {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
  })
}

export function register(payload: RegisterPayload) {
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
    auth: false,
  })
}

export function getMe() {
  return apiClient<User>("/auth/me")
}
