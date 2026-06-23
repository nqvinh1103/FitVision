import { createBrowserRouter, Navigate } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { LandingLayout } from "@/components/layout/LandingLayout"
import { LazyPage } from "@/components/common/LazyPage"
import {
  AdminDashboardPage,
  AdminUsersPage,
  ChallengesPage,
  DashboardPage,
  LandingPage,
  LoginPage,
  MarketplacePage,
  PaymentPage,
  RegisterPage,
  TrainerAlertsPage,
  TrainerDashboardPage,
  TrainerProgramsPage,
  UnauthorizedPage,
  WorkoutPage,
} from "@/app/lazy-pages"
import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { RoleRoute } from "@/routes/RoleRoute"

export const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [
      {
        path: "/",
        element: (
          <LazyPage>
            <LandingPage />
          </LazyPage>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
      {
        path: "/register",
        element: (
          <LazyPage>
            <RegisterPage />
          </LazyPage>
        ),
      },
    ],
  },
  // {
  //   path: "/unauthorized",
  //   element: (
  //     <LazyPage>
  //       <UnauthorizedPage />
  //     </LazyPage>
  //   ),
  // },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: "/dashboard",
            element: (
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            ),
          },
          {
            path: "/workout",
            element: (
              <LazyPage>
                <WorkoutPage />
              </LazyPage>
            ),
          },
          {
            path: "/payment",
            element: (
              <LazyPage>
                <PaymentPage />
              </LazyPage>
            ),
          },
          {
            path: "/challenges",
            element: (
              <LazyPage>
                <ChallengesPage />
              </LazyPage>
            ),
          },
          {
            path: "/marketplace",
            element: (
              <LazyPage>
                <MarketplacePage />
              </LazyPage>
            ),
          },
        ],
      },
      {
        // element: <RoleRoute allowedRoles={["trainer"]} />,
        children: [
          {
            element: <AppShell />,
            children: [
              {
                path: "/trainer/dashboard",
                element: (
                  <LazyPage>
                    <TrainerDashboardPage />
                  </LazyPage>
                ),
              },
              {
                path: "/trainer/programs",
                element: (
                  <LazyPage>
                    <TrainerProgramsPage />
                  </LazyPage>
                ),
              },
              {
                path: "/trainer/alerts",
                element: (
                  <LazyPage>
                    <TrainerAlertsPage />
                  </LazyPage>
                ),
              },
            ],
          },
        ],
      },
      {
        // element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          {
            element: <AppShell />,
            children: [
              {
                path: "/admin/dashboard",
                element: (
                  <LazyPage>
                    <AdminDashboardPage />
                  </LazyPage>
                ),
              },
              {
                path: "/admin/users",
                element: (
                  <LazyPage>
                    <AdminUsersPage />
                  </LazyPage>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])
