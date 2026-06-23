import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth.store"

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    logout()
    queryClient.clear()
    navigate("/", { replace: true })
  }
}
