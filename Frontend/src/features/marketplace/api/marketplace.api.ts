import { mockResponse } from "@/lib/api/mock"
import { mockMarketplacePrograms } from "@/lib/api/mock-data"
import type { CreateProgramPayload, MarketplaceProgram } from "@/features/marketplace/types"

export function getMarketplacePrograms() {
  return mockResponse(mockMarketplacePrograms)
}

export function getMarketplaceProgram(id: number) {
  const program = mockMarketplacePrograms.find((p) => p.id === id)
  if (!program) throw new Error("Program not found")
  return mockResponse(program)
}

export function createProgramWithAi(payload: CreateProgramPayload) {
  const program: MarketplaceProgram = {
    id: Date.now(),
    title: payload.title,
    trainerName: "You",
    description: payload.prompt,
    price: 49,
    rating: 0,
    exerciseCount: 12,
  }
  return mockResponse(program)
}

export function purchaseProgram(_id: number) {
  return mockResponse(undefined)
}
