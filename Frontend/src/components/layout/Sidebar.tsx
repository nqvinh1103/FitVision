import { Link, useLocation } from "react-router-dom"
import {
  DumbbellIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  ShieldIcon,
  ShoppingBagIcon,
  TrophyIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { useAuthStore } from "@/stores/auth.store"
import { useUiStore } from "@/stores/ui.store"
import type { UserRole } from "@/types/user.types"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const traineeNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Workout", href: "/workout", icon: DumbbellIcon },
  { label: "Challenges", href: "/challenges", icon: TrophyIcon },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBagIcon },
  { label: "Credits", href: "/payment", icon: WalletIcon },
]

const trainerNav: NavItem[] = [
  { label: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboardIcon },
  { label: "Programs", href: "/trainer/programs", icon: DumbbellIcon },
  { label: "Alerts", href: "/trainer/alerts", icon: UsersIcon },
]

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: ShieldIcon },
  { label: "Users", href: "/admin/users", icon: UsersIcon },
]

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case "trainer":
      return trainerNav
    case "admin":
      return adminNav
    default:
      return traineeNav
  }
}

export function Sidebar() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  if (!user) return null

  const navItems = getNavItems(user.role)

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <Link to="/" className="font-heading text-lg font-semibold">
            FitVision AI
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <MenuIcon />
          </Button>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => useUiStore.getState().setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Separator />

        <div className="p-3">
          <div className="mb-2 truncate px-3 text-xs text-muted-foreground">
            {user.name} · {user.role}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={logout}
          >
            <LogOutIcon className="size-4" />
            Log out
          </Button>
        </div>
      </aside>
    </>
  )
}
