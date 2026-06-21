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
