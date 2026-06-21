import pytest
from unittest.mock import AsyncMock, MagicMock
from app.workers.cv_worker import process_cv_job
from app.models.job_schemas import CvJobPayload


@pytest.mark.asyncio
async def test_process_cv_job_returns_result():
    mock_job = MagicMock()
    mock_job.id = "test-job-123"
    mock_job.data = {
        "sessionId": 1,
        "userId": 42,
        "exerciseId": 1,
        "keypoints": [[0.1] * 132],
        "startTime": "2026-01-01T00:00:00Z",
        "endTime": "2026-01-01T00:01:00Z",
        "hmacSignature": "dummy-sig",
    }

    result = await process_cv_job(mock_job, "mock-token")

    assert result["sessionId"] == 1
    assert "score" in result
    assert "reps" in result
