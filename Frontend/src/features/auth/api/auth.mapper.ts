import type { AuthResponse } from "@/features/auth/types"
import type { User, UserRole } from "@/types/user.types"

interface BackendUser {
  id: number
  email: string
  name: string | null
  role: string
  aiCredits?: number
}

interface BackendAuthResponse {
  accessToken: string
  user: BackendUser
}

function normalizeRole(role: string): UserRole {
  const normalized = role.toLowerCase()

  if (normalized === "trainer" || normalized === "admin") {
    return normalized
  }

  return "trainee"
}

export function normalizeUser(user: BackendUser): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.email.split("@")[0] ?? "User",
    role: normalizeRole(user.role),
    aiCredits: user.aiCredits,
  }
}

export function mapAuthResponse(response: BackendAuthResponse): AuthResponse {
  return {
    token: response.accessToken,
    user: normalizeUser(response.user),
  }
}

export function mapUserResponse(user: BackendUser): User {
  return normalizeUser(user)
}
