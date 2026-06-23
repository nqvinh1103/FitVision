import { apiClient } from "@/lib/api/client"
import type { AdminStats, AdminUser } from "@/features/admin/types"

interface BackendAdminUser {
  id: number
  email: string
  name: string | null
  role: string
  aiCredits: number
  createdAt: string
}

function mapAdminUser(user: BackendAdminUser): AdminUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.email.split("@")[0] ?? "User",
    role: user.role.toLowerCase(),
    aiCredits: user.aiCredits,
    createdAt: user.createdAt,
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const users = await getAdminUsers()

  return {
    totalUsers: users.length,
    totalTrainers: users.filter((user) => user.role === "trainer").length,
    totalRevenue: 0,
    activeChallenges: 0,
  }
}

export async function getAdminUsers() {
  const users = await apiClient<BackendAdminUser[]>("/users")
  return users.map(mapAdminUser)
}
