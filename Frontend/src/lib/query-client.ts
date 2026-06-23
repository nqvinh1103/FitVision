import { QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/types/api.types"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        const message =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Something went wrong"
        toast.error(message)
      },
    },
  },
})
