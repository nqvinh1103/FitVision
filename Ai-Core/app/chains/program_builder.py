from typing import Dict, List

from langchain_core.documents import Document
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_postgres import PGVector

_PROMPT_TEMPLATE = """\
Bạn là AI Trainer. Tạo một giáo án tập luyện dựa trên yêu cầu sau.
CHỈ sử dụng các bài tập được cung cấp trong danh sách dưới đây. Không tự thêm bài tập khác.

Yêu cầu: {prompt}

Danh sách bài tập khả dụng:
{exercises_context}

Trả về JSON hợp lệ theo schema sau, không có markdown, không có ```json:
{{
  "program_name": "string",
  "description": "string",
  "duration_weeks": integer,
  "sessions_per_week": integer,
  "exercises": [
    {{
      "exercise_id": integer,
      "day_of_week": integer,
      "sets": integer,
      "reps": integer,
      "order_in_session": integer,
      "notes": "string hoặc null"
    }}
  ]
}}"""


def _format_docs(docs: List[Document]) -> str:
    if not docs:
        return ""
    lines = []
    for doc in docs:
        ex_id = doc.metadata.get("exercise_id", "?")
        lines.append(f"- ID {ex_id}: {doc.page_content}")
    return "\n".join(lines)


def _build_exercise_map(docs: List[Document]) -> Dict[int, str]:
    result = {}
    for doc in docs:
        ex_id = doc.metadata.get("exercise_id")
        if ex_id is None:
            continue
        # prefer metadata name (set by embed_exercises.py); fall back to page_content prefix
        name = doc.metadata.get("exercise_name") or doc.page_content.split(".")[0].strip()
        result[ex_id] = name
    return result


def _langchain_db_url(url: str) -> str:
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


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
    retriever = store.as_retriever(search_kwargs={"k": 8})

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
        google_api_key=gemini_api_key,
    )

    prompt = PromptTemplate(
        input_variables=["prompt", "exercises_context"],
        template=_PROMPT_TEMPLATE,
    )

    llm_chain = prompt | llm | JsonOutputParser()

    def _invoke(user_prompt: str) -> dict:
        docs = retriever.invoke(user_prompt)
        exercise_map = _build_exercise_map(docs)

        result = llm_chain.invoke({
            "prompt": user_prompt,
            "exercises_context": _format_docs(docs),
        })

        invalid_ids = [
            e["exercise_id"]
            for e in result.get("exercises", [])
            if e["exercise_id"] not in exercise_map
        ]
        if invalid_ids:
            raise ValueError(f"LLM hallucinated exercise IDs: {invalid_ids}")

        for exercise in result["exercises"]:
            exercise["exercise_name"] = exercise_map[exercise["exercise_id"]]

        return result

    return RunnableLambda(_invoke)
