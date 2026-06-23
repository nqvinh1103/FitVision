import type { AdminStats, AdminUser } from "@/features/admin/types"
import type { Challenge } from "@/features/challenge/types"
import type { TrainerAlert, TrainerDashboardStats, TrainingProgram } from "@/features/trainer/types"
import type { MarketplaceProgram } from "@/features/marketplace/types"
import type { CreditPackage, Transaction } from "@/features/payment/types"
import type { WorkoutSession } from "@/features/workout/types"
import type { User } from "@/types/user.types"

export const mockDashboardData = {
  aiCredits: 12,
  role: "trainee" as const,
}

export const mockTrainerDashboardStats: TrainerDashboardStats = {
  totalTrainees: 45,
  redGroupCount: 2,
  sessionsToday: 18,
  avgFormScore: 84,
}

export const mockTrainerAlerts: TrainerAlert[] = [
  {
    id: 1,
    traineeName: "Student A",
    exerciseName: "Squat form danger",
    riskLevel: "high",
    formScore: 58,
    createdAt: "2026-06-23T08:15:00Z",
  },
  {
    id: 2,
    traineeName: "Student B",
    exerciseName: "Inactive 7+ days",
    riskLevel: "medium",
    formScore: 72,
    createdAt: "2026-06-22T14:30:00Z",
  },
  {
    id: 3,
    traineeName: "Student C",
    exerciseName: "Deadlift hip hinge",
    riskLevel: "low",
    formScore: 81,
    createdAt: "2026-06-21T10:00:00Z",
  },
]

export const mockTrainerPrograms: TrainingProgram[] = [
  {
    id: 1,
    title: "Hypertrophy — Upper bias",
    status: "published",
    price: 49,
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Strength — Powerlifting prep",
    status: "draft",
    price: 79,
    createdAt: "2026-06-10T00:00:00Z",
  },
]

export const mockWorkoutSessions: WorkoutSession[] = [
  {
    id: 1,
    exerciseName: "Back Squat",
    reps: 32,
    formScore: 88,
    createdAt: "2026-06-23T07:30:00Z",
  },
  {
    id: 2,
    exerciseName: "Romanian Deadlift",
    reps: 24,
    formScore: 91,
    createdAt: "2026-06-22T18:00:00Z",
  },
]

export const mockChallenges: Challenge[] = [
  {
    id: 1,
    title: "100 Squat Challenge",
    description: "Complete 100 squats with 85%+ form score this week.",
    rewardCredits: 5,
    targetReps: 100,
    deadline: "2026-06-30T23:59:59Z",
    status: "active",
  },
  {
    id: 2,
    title: "Perfect Form Week",
    description: "Maintain 90%+ average form across 5 sessions.",
    rewardCredits: 10,
    targetReps: 5,
    deadline: "2026-07-07T23:59:59Z",
    status: "active",
  },
]

export const mockMarketplacePrograms: MarketplaceProgram[] = [
  {
    id: 1,
    title: "AI Hypertrophy Block",
    trainerName: "Coach Minh",
    description: "8-week upper/lower split generated from your form history.",
    price: 39,
    rating: 4.8,
    exerciseCount: 24,
  },
  {
    id: 2,
    title: "Metcon Engine Builder",
    trainerName: "Coach Lan",
    description: "Conditioning program with RPE-based progressions.",
    price: 29,
    rating: 4.6,
    exerciseCount: 18,
  },
]

export const mockCreditPackages: CreditPackage[] = [
  { id: 1, name: "Starter", credits: 10, price: 99000 },
  { id: 2, name: "Pro", credits: 30, price: 249000 },
  { id: 3, name: "Elite", credits: 100, price: 699000 },
]

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    amount: 99000,
    credits: 10,
    status: "completed",
    createdAt: "2026-06-15T09:00:00Z",
  },
]

export const mockAdminStats: AdminStats = {
  totalUsers: 1280,
  totalTrainers: 86,
  totalRevenue: 245000000,
  activeChallenges: 12,
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: 1,
    name: "Alex Nguyen",
    email: "alex@fitvision.ai",
    role: "trainee",
    aiCredits: 12,
    createdAt: "2026-05-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Coach Minh",
    email: "minh@fitvision.ai",
    role: "trainer",
    aiCredits: 50,
    createdAt: "2026-04-15T00:00:00Z",
  },
]

export function createMockUser(
  email: string,
  name: string,
  role: User["role"] = "trainee",
): User {
  return {
    id: Math.floor(Math.random() * 10000),
    email,
    name,
    role,
    aiCredits: role === "trainer" ? 50 : 12,
  }
}

export const MOCK_TOKEN = "mock-jwt-token"
