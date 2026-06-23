from pydantic import BaseModel
from typing import Optional, List


class CvJobPayload(BaseModel):
    sessionId: int
    userId: int
    exerciseId: int
    keypoints: List[List[float]]  # [frame_index][joint_coords]
    startTime: str
    endTime: str
    hmacSignature: str

class CvJobResult(BaseModel):
    jobId: str
    sessionId: int
    score: float
    reps: int
    alerts: List[str] = []
    error: Optional[str] = None

# ── NLP ───────────────────────────────────────────────────────────────────────

class NlpJobPayload(BaseModel):
      userId: int
      prompt: str
      context: Optional[str] = None


class ExerciseSlot(BaseModel):
      exercise_id: int
      day_of_week: int
      sets: int
      reps: int
      order_in_session: int
      notes: Optional[str] = None


class ProgramOutput(BaseModel):
      program_name: str
      description: str
      duration_weeks: int
      sessions_per_week: int
      exercises: List[ExerciseSlot]
