export type UserRole = "trainee" | "trainer" | "admin"

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  aiCredits?: number
}
