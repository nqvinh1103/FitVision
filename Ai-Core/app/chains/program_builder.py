from typing import Dict, List, Optional

from langchain_core.documents import Document
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_postgres import PGVector
from pydantic import BaseModel

from app.models.job_schemas import UserProfile

# ── Prompt templates ──────────────────────────────────────────────────────────

_PLANNER_TEMPLATE = """\
Bạn là chuyên gia lập kế hoạch tập luyện calisthenics. Dựa trên yêu cầu và hồ sơ người dùng, \
hãy thiết kế cấu trúc giáo án phù hợp.

Yêu cầu: {prompt}

Hồ sơ người dùng:
- Trình độ: {fitness_level}
- Mục tiêu: {goal}
- Có xà đơn: {has_pull_up_bar}
- Có xà kép/thanh song song: {has_parallel_bars}
- Chấn thương/hạn chế: {injuries}

Lưu ý quan trọng:
- Nếu KHÔNG có xà đơn: KHÔNG được xếp Pull Up, Chin Up, Neutral Grip Pull Up, Australian Pull Up, Muscle Up, Hanging Knee Raise, Hanging Leg Raise.
- Nếu KHÔNG có xà kép: KHÔNG được xếp Dips, L-Sit, Muscle Up.

Trả về JSON hợp lệ, không có markdown, không có ```json:
{{
  "split_type": "Full Body | Push/Pull | Upper/Lower | Push/Pull/Legs",
  "sessions_per_week": <integer 2-5>,
  "duration_weeks": <integer 3-6>,
  "days": [
    {{
      "day_number": <1 đến sessions_per_week, ví dụ 1, 2, 3 cho 3 buổi/tuần>,
      "focus": "<mô tả ngắn ngày tập, ví dụ: Push - Ngực, Vai, Tay sau>",
      "query": "<chuỗi tìm kiếm tiếng Anh cho ngày này, ví dụ: push chest shoulders triceps beginner>"
    }}
  ]
}}"""

_BUILDER_TEMPLATE = """\
Bạn là AI Trainer. Tạo giáo án tập luyện chi tiết dựa trên cấu trúc đã lên kế hoạch.
CHỈ sử dụng các bài tập được cung cấp trong mỗi buổi. Không tự thêm bài tập khác.

Yêu cầu gốc: {prompt}
Trình độ: {fitness_level} | Mục tiêu: {goal}
Số tuần: {duration_weeks}

Danh sách bài tập theo từng buổi:
{day_contexts}

Yêu cầu về progressive overload: Tạo mảng "progressions" cho mỗi bài tập với sets/reps tăng dần \
qua {duration_weeks} tuần (ví dụ tuần 1: 3x8, tuần 2: 3x10, tuần 3: 4x10, tuần 4: 4x12).

Trả về JSON hợp lệ, không có markdown, không có ```json:
{{
  "program_name": "string",
  "description": "string",
  "duration_weeks": <integer>,
  "sessions_per_week": <integer>,
  "exercises": [
    {{
      "exercise_id": <integer>,
      "day_number": <integer — số thứ tự buổi trong tuần, ví dụ 1, 2, 3>,
      "sets": <integer tuần 1>,
      "reps": <integer tuần 1>,
      "order_in_session": <integer>,
      "notes": "hướng dẫn kỹ thuật cho Trainee hoặc null",
      "progressions": [
        {{"week": 1, "sets": <int>, "reps": <int>}},
        {{"week": 2, "sets": <int>, "reps": <int>}}
      ]
    }}
  ]
}}"""


# ── Pydantic models cho Phase 1 output ───────────────────────────────────────

class DayPlan(BaseModel):
    day_number: int
    focus: str
    query: str


class TrainingPlan(BaseModel):
    split_type: str
    sessions_per_week: int
    duration_weeks: int
    days: List[DayPlan]


# ── Helpers ───────────────────────────────────────────────────────────────────

def _format_docs(docs: List[Document]) -> str:
    if not docs:
        return "(không có bài tập)"
    return "\n".join(
        f"- ID {doc.metadata.get('exercise_id', '?')}: {doc.page_content}"
        for doc in docs
    )


def _build_exercise_map(docs: List[Document]) -> Dict[int, str]:
    result = {}
    for doc in docs:
        ex_id = doc.metadata.get("exercise_id")
        if ex_id is None:
            continue
        name = doc.metadata.get("exercise_name") or doc.page_content.split(".")[0].strip()
        result[ex_id] = name
    return result


def _format_day_contexts(days: List[DayPlan], day_docs: Dict[int, List[Document]]) -> str:
    blocks = []
    for day in days:
        docs = day_docs.get(day.day_number, [])
        blocks.append(f"=== Buổi {day.day_number}: {day.focus} ===\n{_format_docs(docs)}")
    return "\n\n".join(blocks)


def _default_profile() -> UserProfile:
    return UserProfile()


def _parse_input(input_data) -> tuple[str, UserProfile]:
    if isinstance(input_data, dict):
        prompt = input_data.get("prompt", "")
        profile = input_data.get("user_profile") or _default_profile()
        if isinstance(profile, dict):
            profile = UserProfile(**profile)
        return prompt, profile
    return str(input_data), _default_profile()


def _validate_exercise_ids(result: dict, retrieved_ids: set) -> None:
    invalid = [
        e["exercise_id"]
        for e in result.get("exercises", [])
        if e["exercise_id"] not in retrieved_ids
    ]
    if invalid:
        raise ValueError(f"LLM hallucinated exercise IDs: {invalid}")


def _normalize_progressions(result: dict, duration_weeks: int) -> None:
    set_ramp = [3, 3, 4, 4]
    rep_offsets = [0, 2, 2, 4]

    for ex in result.get("exercises", []):
        base_sets = ex.get("sets", 3)
        base_reps = ex.get("reps", 8)

        if not ex.get("progressions"):
            ex["progressions"] = [
                {
                    "week": w + 1,
                    "sets": set_ramp[w] if w < len(set_ramp) else base_sets,
                    "reps": base_reps + (rep_offsets[w] if w < len(rep_offsets) else 0),
                }
                for w in range(duration_weeks)
            ]

        week1 = ex["progressions"][0]
        ex["sets"] = week1["sets"]
        ex["reps"] = week1["reps"]
        # progressions is stored in its own DB column — do not pollute notes field


def _annotate_names(result: dict, exercise_map: Dict[int, str]) -> None:
    for ex in result.get("exercises", []):
        ex["exercise_name"] = exercise_map.get(ex["exercise_id"])


def _langchain_db_url(url: str) -> str:
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


# ── Chain factory ─────────────────────────────────────────────────────────────

def build_chain(database_url: str, gemini_api_key: str):
    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-2",
        google_api_key=gemini_api_key,
    )

    store = PGVector(
        embeddings=embeddings,
        collection_name="exercises",
        connection=_langchain_db_url(database_url),
    )
    retriever = store.as_retriever(search_kwargs={"k": 6})

    planner_llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.2,
        google_api_key=gemini_api_key,
    )
    builder_llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.4,
        google_api_key=gemini_api_key,
    )

    planner_chain = (
        PromptTemplate(
            input_variables=["prompt", "fitness_level", "goal", "has_pull_up_bar", "has_parallel_bars", "injuries"],
            template=_PLANNER_TEMPLATE,
        )
        | planner_llm
        | JsonOutputParser()
    )

    builder_chain = (
        PromptTemplate(
            input_variables=["prompt", "fitness_level", "goal", "duration_weeks", "day_contexts"],
            template=_BUILDER_TEMPLATE,
        )
        | builder_llm
        | JsonOutputParser()
    )

    def _invoke(input_data) -> dict:
        prompt, profile = _parse_input(input_data)

        # Phase 1: Planner
        raw_plan = planner_chain.invoke({
            "prompt": prompt,
            "fitness_level": profile.fitness_level,
            "goal": profile.goal,
            "has_pull_up_bar": "Có" if profile.has_pull_up_bar else "Không",
            "has_parallel_bars": "Có" if profile.has_parallel_bars else "Không",
            "injuries": ", ".join(profile.injuries) if profile.injuries else "Không có",
        })
        plan = TrainingPlan(**raw_plan)

        # Phase 2: Targeted retrieval per day
        day_docs: Dict[int, List[Document]] = {}
        exercise_map: Dict[int, str] = {}
        for day in plan.days:
            docs = retriever.invoke(day.query)
            day_docs[day.day_number] = docs
            exercise_map.update(_build_exercise_map(docs))

        # Phase 3: Builder
        result = builder_chain.invoke({
            "prompt": prompt,
            "fitness_level": profile.fitness_level,
            "goal": profile.goal,
            "duration_weeks": plan.duration_weeks,
            "day_contexts": _format_day_contexts(plan.days, day_docs),
        })

        result["split_type"] = plan.split_type

        _validate_exercise_ids(result, set(exercise_map.keys()))
        _normalize_progressions(result, plan.duration_weeks)
        _annotate_names(result, exercise_map)

        return result

    return RunnableLambda(_invoke)
