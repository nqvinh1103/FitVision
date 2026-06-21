from contextlib import asynccontextmanager
import asyncio
from typing import Optional
from fastapi import FastAPI
from app.api.health import router as health_router
from app.config import settings


_worker_task: Optional[asyncio.Task] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Không start worker trong môi trường test — tránh yêu cầu Redis khi chạy pytest
    if settings.environment != "test":
        from app.workers.cv_worker import run_cv_worker
        global _worker_task
        _worker_task = asyncio.create_task(run_cv_worker())
    yield
    if _worker_task:
        _worker_task.cancel()
        try:
            await _worker_task
        except asyncio.CancelledError:
            pass


app = FastAPI(title="FitVision AI-Core", version="1.0.0", lifespan=lifespan)

app.include_router(health_router, prefix="/health", tags=["health"])
