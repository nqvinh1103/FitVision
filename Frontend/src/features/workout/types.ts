export interface PoseLandmark {
  x: number
  y: number
  z: number
  visibility?: number
}

export interface WorkoutSession {
  id: number
  exerciseName: string
  reps: number
  formScore: number
  createdAt: string
}

export interface SubmitSessionPayload {
  exerciseId: number
  landmarks: PoseLandmark[][]
  startTime: string
  endTime: string
  hmacSignature: string
}
