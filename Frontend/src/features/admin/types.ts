export interface AdminStats {
  totalUsers: number
  totalTrainers: number
  totalRevenue: number
  activeChallenges: number
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  aiCredits: number
  createdAt: string
}
