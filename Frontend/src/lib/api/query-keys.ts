export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  workouts: {
    all: ["workouts"] as const,
    detail: (id: number) => ["workouts", id] as const,
    sessions: ["workout-sessions"] as const,
  },
  payment: {
    transactions: ["transactions"] as const,
    credits: ["credits"] as const,
  },
  trainer: {
    dashboard: ["trainer", "dashboard"] as const,
    alerts: ["trainer", "alerts"] as const,
    trainees: ["trainer", "trainees"] as const,
  },
  marketplace: {
    programs: ["marketplace", "programs"] as const,
    program: (id: number) => ["marketplace", "programs", id] as const,
  },
  challenges: {
    all: ["challenges"] as const,
    detail: (id: number) => ["challenges", id] as const,
  },
  admin: {
    users: ["admin", "users"] as const,
    stats: ["admin", "stats"] as const,
  },
} as const
