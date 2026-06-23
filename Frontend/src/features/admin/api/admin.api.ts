import { mockResponse } from "@/lib/api/mock"
import { mockAdminStats, mockAdminUsers } from "@/lib/api/mock-data"

export function getAdminStats() {
  return mockResponse(mockAdminStats)
}

export function getAdminUsers() {
  return mockResponse(mockAdminUsers)
}
