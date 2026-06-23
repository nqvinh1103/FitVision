from urllib.parse import urlparse
import asyncio
from bullmq import Worker
from app.config import settings
from app.models.job_schemas import CvJobPayload, CvJobResult


async def process_cv_job(job, job_token: str) -> dict:
    """
    Entry point cho mỗi CV job từ queue.
    Real logic sẽ được implement trong app/modules/cv/.
    """
    payload = CvJobPayload(**job.data)

    # Placeholder: thay bằng rep_counter + pose_classifier sau
    result = CvJobResult(
        jobId=job.id,
        sessionId=payload.sessionId,
        score=0.0,
        reps=0,
        alerts=[],
    )

    return result.model_dump()


async def run_cv_worker() -> None:
    parsed = urlparse(settings.redis_url)
    connection = {
        "host": parsed.hostname or "localhost",
        "port": parsed.port or 6379,
    }
    if parsed.password:
        connection["password"] = parsed.password
    if parsed.username:
        connection["username"] = parsed.username
    if parsed.scheme == "rediss":
        connection["ssl"] = True

    worker = Worker("cv-jobs", process_cv_job, {"connection": connection})
    print("[CV Worker] Started — listening for cv-jobs")

    try:
        while True:
            await asyncio.sleep(3600)
    finally:
        await worker.close()
        print("[CV Worker] Stopped")
