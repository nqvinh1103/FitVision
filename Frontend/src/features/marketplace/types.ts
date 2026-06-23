export interface MarketplaceProgram {
  id: number
  title: string
  trainerName: string
  description: string
  price: number
  rating: number
  exerciseCount: number
}

export interface CreateProgramPayload {
  prompt: string
  title: string
}
