import { mockResponse } from "@/lib/api/mock"
import { mockTrainerAlerts, mockTrainerDashboardStats, mockTrainerPrograms } from "@/lib/api/mock-data"

export function getTrainerDashboard() {
  return mockResponse(mockTrainerDashboardStats)
}

export function getTrainerAlerts() {
  return mockResponse(mockTrainerAlerts)
}

export function getTrainerPrograms() {
  return mockResponse(mockTrainerPrograms)
}
