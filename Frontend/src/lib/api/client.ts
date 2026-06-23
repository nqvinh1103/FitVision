import { ApiError, type ApiErrorBody } from "@/types/api.types"
import { useAuthStore } from "@/stores/auth.store"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
  auth?: boolean
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody
    return body.error ?? body.message ?? response.statusText
  } catch {
    return response.statusText
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers: customHeaders, ...init } = options

  const headers = new Headers(customHeaders)

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (auth) {
    const token = useAuthStore.getState().token
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...init,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const message = await parseError(response)
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
