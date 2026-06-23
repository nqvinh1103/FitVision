import { mockResponse } from "@/lib/api/mock"
import { mockChallenges } from "@/lib/api/mock-data"

export function getChallenges() {
  return mockResponse(mockChallenges)
}

export function getChallenge(id: number) {
  const challenge = mockChallenges.find((c) => c.id === id)
  if (!challenge) throw new Error("Challenge not found")
  return mockResponse(challenge)
}

export function joinChallenge(_id: number) {
  return mockResponse(undefined)
}
