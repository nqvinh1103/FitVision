-- Manual indexes applied outside prisma migrate.
-- Run once via Neon SQL editor or: psql $DATABASE_URL -f this_file.sql
-- Requires pgvector >= 0.5.0 for HNSW support.

-- HNSW index: O(log n) approximate nearest-neighbor for RAG vector search
CREATE INDEX IF NOT EXISTS exercises_embedding_hnsw_idx
  ON exercises USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- GIN index: fast filter on training_sessions.result JSONB
-- Powers the AI Dashboard Red Group query (score < 60 + alert detection)
CREATE INDEX IF NOT EXISTS training_sessions_result_gin_idx
  ON training_sessions USING gin (result);
