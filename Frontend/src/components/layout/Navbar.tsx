import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { useAuthStore } from "@/stores/auth.store"
import { useUiStore } from "@/stores/ui.store"

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={toggleSidebar}
        aria-label="Open sidebar"
      >
        <MenuIcon />
      </Button>

      <div className="flex flex-1 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </p>
        <div className="flex items-center gap-2">
          {user?.aiCredits !== undefined ? (
            <Badge variant="secondary">{user.aiCredits} AI Credits</Badge>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
