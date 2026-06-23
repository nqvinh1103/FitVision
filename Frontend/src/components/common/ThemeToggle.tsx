import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUiStore } from "@/stores/ui.store"

export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
