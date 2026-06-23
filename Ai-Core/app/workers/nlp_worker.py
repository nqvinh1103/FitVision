import asyncio
from urllib.parse import urlparse

from bullmq import Worker

from app.chains.program_builder import build_chain
from app.config import settings
from app.models.job_schemas import NlpJobPayload, ProgramOutput

_chain = None


def get_chain():
    global _chain
    if _chain is None:
        _chain = build_chain(settings.database_url, settings.gemini_api_key)
    return _chain


async def process_nlp_job(job, job_token: str) -> dict:
    payload = NlpJobPayload(**job.data)

    combined_prompt = payload.prompt
    if payload.context:
        combined_prompt = f"{payload.prompt}\n\nThêm context: {payload.context}"

    result = get_chain().invoke(combined_prompt)
    validated = ProgramOutput(**result)
    return validated.model_dump()


async def run_nlp_worker() -> None:
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
        connection["tls"] = {}

    worker = Worker("nlp-jobs", process_nlp_job, {"connection": connection})
    print("[NLP Worker] Started — listening for nlp-jobs")

    try:
        while True:
            await asyncio.sleep(3600)
    finally:
        await worker.close()
        print("[NLP Worker] Stopped")
