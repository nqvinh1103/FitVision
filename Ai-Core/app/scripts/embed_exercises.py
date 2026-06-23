import time
from typing import List, Tuple

import psycopg2
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_postgres import PGVector

from app.chains.program_builder import _langchain_db_url
from app.config import settings

BATCH_SIZE = 100
COLLECTION_NAME = "exercises"


def _fetch_unembedded(database_url: str) -> List[Tuple]:
    conn = psycopg2.connect(database_url)
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, description, muscles_targeted FROM exercises WHERE embedding IS NULL"
        )
        return cur.fetchall()
    finally:
        conn.close()


def _build_store(database_url: str, gemini_api_key: str) -> PGVector:
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004",
        google_api_key=gemini_api_key,
    )
    return PGVector(
        embeddings=embeddings,
        collection_name=COLLECTION_NAME,
        connection=_langchain_db_url(database_url),
    )


def main() -> None:
    rows = _fetch_unembedded(settings.database_url)

    if not rows:
        print("All exercises already embedded.")
        return

    print(f"Embedding {len(rows)} exercises...")
    store = _build_store(settings.database_url, settings.gemini_api_key)

    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        docs = [
            Document(
                page_content=f"{name}. {description or ''}. Muscles: {muscle_group or ''}",
                metadata={"exercise_id": row_id},
            )
            for row_id, name, description, muscle_group in batch
        ]
        ids = [str(row[0]) for row in batch]
        store.add_documents(docs, ids=ids)
        done = min(i + BATCH_SIZE, len(rows))
        print(f"Embedded {done}/{len(rows)}")
        if done < len(rows):
            time.sleep(1)

    print("Done.")


if __name__ == "__main__":
    main()
