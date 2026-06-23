export interface TrainerAlert {
  id: number
  traineeName: string
  exerciseName: string
  riskLevel: "high" | "medium" | "low"
  formScore: number
  createdAt: string
}

export interface TrainerDashboardStats {
  totalTrainees: number
  redGroupCount: number
  sessionsToday: number
  avgFormScore: number
}

export interface TrainingProgram {
  id: number
  title: string
  status: "draft" | "published"
  price: number
  createdAt: string
}
