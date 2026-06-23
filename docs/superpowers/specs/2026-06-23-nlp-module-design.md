# NLP Module Design — FitVision AI Core

**Date:** 2026-06-23  
**Branch:** feature/ai-core  
**Scope:** NLP Module only (CV Module is a separate spec)

---

## 1. Problem Statement

Trainer nhập một prompt mô tả nhu cầu (ví dụ: "giáo án tăng cơ cho người mới 3 buổi/tuần"). Hệ thống phải sinh ra một giáo án cụ thể có tên bài tập thực tế từ DB, không phải tên bịa đặt (hallucination). Kết quả trả về dưới dạng JSON để Backend ghi vào `training_programs` + `program_exercises`.

---

## 2. Architecture Overview

```
[Backend Node.js]
  └── addNlpJob(userId, { prompt, context? })
         ↓ BullMQ nlp-queue
[Ai-Core Python]
  └── nlp_worker.py  — consume job
         ↓
  └── chains/program_builder.py  — LangChain RAG chain
         │
         ├── GoogleGenerativeAIEmbeddings("text-embedding-004")  — embed prompt
         ├── PGVector retriever  — top-8 exercises từ DB
         ├── PromptTemplate  — inject exercises vào context
         ├── ChatGoogleGenerativeAI("gemini-2.0-flash")  — generate
         └── JsonOutputParser + Pydantic validation
         ↓
  └── job.returnvalue = ProgramOutput dict
         ↓ BullMQ "completed" event
[Backend Node.js]
  └── INSERT training_programs + program_exercises
```

---

## 3. Directory Structure

```
Ai-Core/app/
├── config.py                    # Settings (đã có)
├── __init__.py                  # FastAPI app + worker startup
├── api/
│   └── health.py                # GET /health
├── workers/
│   └── nlp_worker.py            # BullMQ consumer
├── chains/
│   └── program_builder.py       # LangChain RAG chain
├── scripts/
│   └── embed_exercises.py       # One-time embedding seed CLI
└── models/
    └── schemas.py               # Pydantic: NlpJobPayload, ProgramOutput
```

---

## 4. Dependencies

Bổ sung vào `requirements.txt`:

```
langchain==0.3.25
langchain-google-genai==2.0.10
langchain-postgres==0.0.13
langchain-core==0.3.58
psycopg[binary]==3.2.9
```

Giữ nguyên `psycopg2-binary` (dùng chỗ khác). `psycopg3` bắt buộc cho `langchain-postgres`.

---

## 5. Embedding Pipeline

**File:** `app/scripts/embed_exercises.py`  
**Trigger:** CLI — `python -m app.scripts.embed_exercises`  
**Chạy khi:** lần đầu setup, hoặc sau khi thêm exercises mới vào DB.

### Logic

1. Kết nối DB qua `psycopg2` (dùng `DATABASE_URL` từ config)
2. `SELECT id, name, description, muscle_group FROM exercises WHERE embedding IS NULL`
3. Tạo `Document` objects với:
   - `page_content = "{name}. {description}. Muscle group: {muscle_group}"`
   - `metadata = {"exercise_id": id}`
4. Gọi `GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")`
5. Gọi `PGVector.from_documents()` — batch 100 records để tránh rate limit
6. Idempotent: filter `WHERE embedding IS NULL` đảm bảo chạy lại không duplicate

### Rate Limit Handling

Gemini Free Tier: 1500 req/min cho embedding. Batch 100 + `time.sleep(1)` giữa các batch là đủ.

---

## 6. RAG Chain

**File:** `app/chains/program_builder.py`

### Chain Architecture

```python
retriever = PGVector(
    embeddings=GoogleGenerativeAIEmbeddings(model="models/text-embedding-004"),
    collection_name="exercises",
    connection=DATABASE_URL,
).as_retriever(search_kwargs={"k": 8})

chain = (
    RunnableParallel(
        exercises_context=retriever,   # vector search dùng prompt làm query
        prompt=RunnablePassthrough(),  # pass-through để dùng trong template
    )
    | PromptTemplate(...)
    | ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    | JsonOutputParser()
)
```

**Lưu ý:** Worker ghép `context` (optional text từ payload) vào `prompt` trước khi gọi `chain.invoke(combined_prompt)`. Chain chỉ nhận một string làm input — `exercises_context` là kết quả retriever, không phải payload context.

### Prompt Template

```
Bạn là AI Trainer. Tạo một giáo án tập luyện dựa trên yêu cầu sau.
CHỈ sử dụng các bài tập được cung cấp trong danh sách dưới đây. Không tự thêm bài tập khác.

Yêu cầu: {prompt}
Thông tin bổ sung: {context_text}

Danh sách bài tập khả dụng:
{exercises_context}

Trả về JSON hợp lệ theo schema sau, không có markdown:
{
  "program_name": "string",
  "description": "string",
  "duration_weeks": integer,
  "sessions_per_week": integer,
  "exercises": [
    {
      "exercise_id": integer,
      "day_of_week": integer (1-7),
      "sets": integer,
      "reps": integer,
      "order_in_session": integer,
      "notes": "string hoặc null"
    }
  ]
}
```

### Temperature

`temperature=0.3` — đủ sáng tạo trong lời mô tả nhưng ổn định trong việc chọn exercise_id đúng.

---

## 7. Pydantic Schemas

**File:** `app/models/schemas.py`

### Input

```python
class NlpJobPayload(BaseModel):
    userId: int
    prompt: str
    context: str | None = None
```

### Output

```python
class ExerciseSlot(BaseModel):
    exercise_id: int
    day_of_week: int          # 1–7
    sets: int
    reps: int
    order_in_session: int
    notes: str | None = None

class ProgramOutput(BaseModel):
    program_name: str
    description: str
    duration_weeks: int
    sessions_per_week: int
    exercises: list[ExerciseSlot]
```

`ProgramOutput` map trực tiếp vào `training_programs` (top-level fields) + `program_exercises` (mảng `exercises`). Backend không cần transform.

---

## 8. BullMQ Worker

**File:** `app/workers/nlp_worker.py`

### Behavior

- Connects to Redis via `REDIS_URL`
- Listens to queue name `"nlp-jobs"` (match với Backend `bullmq.client.ts` line 13)
- Mỗi job:
  1. Parse payload thành `NlpJobPayload`
  2. Ghép `combined_prompt = f"{payload.prompt}\n\nThêm context: {payload.context}"` nếu có context
  3. Gọi `program_builder.chain.invoke(combined_prompt)`
  4. Validate result với `ProgramOutput`
  5. Return `result.model_dump()` — BullMQ lưu làm `job.returnvalue`

### Error Handling

| Lỗi | Hành vi |
|---|---|
| JSON parse fail (LLM output sai format) | Exception → BullMQ retry (max 2) |
| Gemini 429 rate limit | Exception → BullMQ fixed backoff 2s retry |
| Pydantic validation fail | Exception → BullMQ retry |
| Hết retry | Job failed, `removeOnFail: 25` tự dọn |

---

## 9. FastAPI App & Entry Point

**File:** `app/__init__.py`

- FastAPI app với `GET /health` → `{ "status": "ok", "service": "ai-core" }`
- Khi startup: khởi động `nlp_worker` trong `asyncio` background task
- Worker và FastAPI share cùng process — không cần supervisor riêng cho MVP

**Chạy:**
```bash
uvicorn app:app --host 0.0.0.0 --port 8001
```

---

## 10. What This Does NOT Cover

- CV Module (chấm điểm tư thế) — spec riêng
- Authentication/authorization cho AI-Core endpoints
- Caching layer cho repeated prompts
- Trainer review/edit flow trước khi publish lên Marketplace
- Monitoring / observability

---

## 11. Success Criteria

1. Script `embed_exercises.py` chạy thành công, cột `embedding` được populate
2. Worker consume job từ `nlp-queue`, gọi Gemini, trả về `ProgramOutput` JSON hợp lệ
3. `exercise_id` trong output luôn là ID tồn tại trong DB (không hallucinate)
4. Health endpoint trả về 200
5. Unit tests cho `program_builder.py` với mock LLM pass
