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

export interface AuthResponse {
  token: string
  user: User
}
