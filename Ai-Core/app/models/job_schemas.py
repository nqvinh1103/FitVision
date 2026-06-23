from typing import List, Literal, Optional

from pydantic import BaseModel


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

class UserProfile(BaseModel):
    fitness_level: Literal["BEGINNER", "INTERMEDIATE", "ADVANCED"] = "INTERMEDIATE"
    has_pull_up_bar: bool = False
    has_parallel_bars: bool = False
    injuries: List[str] = []
    goal: Literal["strength", "fat_loss", "endurance", "general_fitness"] = "general_fitness"


class WeekProgression(BaseModel):
    week: int
    sets: int
    reps: int


class NlpJobPayload(BaseModel):
    userId: int
    prompt: str
    context: Optional[str] = None
    user_profile: Optional[UserProfile] = None


class ExerciseSlot(BaseModel):
    exercise_id: int
    exercise_name: Optional[str] = None
    day_of_week: int
    sets: int
    reps: int
    order_in_session: int
    notes: Optional[str] = None
    progressions: Optional[List[WeekProgression]] = None


class ProgramOutput(BaseModel):
    program_name: str
    description: str
    split_type: Optional[str] = None
    duration_weeks: int
    sessions_per_week: int
    exercises: List[ExerciseSlot]
