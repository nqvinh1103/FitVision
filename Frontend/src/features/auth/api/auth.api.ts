import { mockResponse } from "@/lib/api/mock"
import { MOCK_TOKEN, createMockUser } from "@/lib/api/mock-data"
import { useAuthStore } from "@/stores/auth.store"
import type { User } from "@/types/user.types"
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/features/auth/types"

export function login(payload: LoginPayload) {
  const user = createMockUser(payload.email, payload.email.split("@")[0] ?? "User", "trainee")
  return mockResponse<AuthResponse>({ token: MOCK_TOKEN, user })
}

export function register(payload: RegisterPayload) {
  const user = createMockUser(
    payload.email,
    payload.name,
    payload.role ?? "trainee",
  )
  return mockResponse<AuthResponse>({ token: MOCK_TOKEN, user })
}

export function getMe() {
  const user = useAuthStore.getState().user
  return mockResponse<User>(
    user ?? createMockUser("demo@fitvision.ai", "Demo User", "trainee"),
  )
}
