import asyncio
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI

from app.api.health import router as health_router
from app.config import settings

_cv_worker_task: Optional[asyncio.Task] = None
_nlp_worker_task: Optional[asyncio.Task] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _cv_worker_task, _nlp_worker_task

    if settings.environment != "test":
        from app.workers.cv_worker import run_cv_worker
        from app.workers.nlp_worker import run_nlp_worker

        _cv_worker_task = asyncio.create_task(run_cv_worker())
        _nlp_worker_task = asyncio.create_task(run_nlp_worker())

    yield

    for task in (_cv_worker_task, _nlp_worker_task):
        if task:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass


app = FastAPI(title="FitVision AI-Core", version="1.0.0", lifespan=lifespan)
app.include_router(health_router, prefix="/health", tags=["health"])
