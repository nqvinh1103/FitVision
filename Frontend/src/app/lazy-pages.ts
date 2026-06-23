import { lazy } from "react"

export const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"))
export const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"))
export const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"))
export const UnauthorizedPage = lazy(() => import("@/features/auth/pages/UnauthorizedPage"))
export const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"))
export const WorkoutPage = lazy(() => import("@/features/workout/pages/WorkoutPage"))
export const PaymentPage = lazy(() => import("@/features/payment/pages/PaymentPage"))
export const ChallengesPage = lazy(() => import("@/features/challenge/pages/ChallengesPage"))
export const MarketplacePage = lazy(() => import("@/features/marketplace/pages/MarketplacePage"))
export const TrainerDashboardPage = lazy(
  () => import("@/features/trainer/pages/TrainerDashboardPage"),
)
export const TrainerProgramsPage = lazy(
  () => import("@/features/trainer/pages/TrainerProgramsPage"),
)
export const TrainerAlertsPage = lazy(() => import("@/features/trainer/pages/TrainerAlertsPage"))
export const AdminDashboardPage = lazy(() => import("@/features/admin/pages/AdminDashboardPage"))
export const AdminUsersPage = lazy(() => import("@/features/admin/pages/AdminUsersPage"))
