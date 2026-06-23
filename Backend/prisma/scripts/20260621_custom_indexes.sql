-- Manual indexes applied outside prisma migrate.
-- Run once via Neon SQL editor or: psql $DATABASE_URL -f this_file.sql
--
-- NOTE: Vector embeddings are stored in LangChain PGVector's own tables
-- (langchain_pg_collection, langchain_pg_embedding), NOT in exercises.embedding.
-- The HNSW index on exercises is therefore not needed here.

-- ─── GIN index: fast JSONB filter on training_sessions ───────────────────────
-- Powers Red Group alert query (consecutive low scores + alert detection)
CREATE INDEX IF NOT EXISTS training_sessions_result_gin_idx
  ON training_sessions USING gin (result);

-- ─── GIN index: injuries filter on user_profiles ─────────────────────────────
-- Powers PersonalizedChain query: "trainee có chấn thương gì?"
CREATE INDEX IF NOT EXISTS user_profiles_injuries_gin_idx
  ON user_profiles USING gin (injuries);

-- ─── GIN index: adjustments filter on weekly_digests ─────────────────────────
-- Powers Trainer Dashboard: filter digests có MAJOR adjustments pending
CREATE INDEX IF NOT EXISTS weekly_digests_adjustments_gin_idx
  ON weekly_digests USING gin (adjustments);

-- ─── B-Tree indexes for new FK columns ───────────────────────────────────────
CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS weekly_digests_trainer_status_idx
  ON weekly_digests (trainer_id, status);

CREATE INDEX IF NOT EXISTS trainer_trainees_status_idx
  ON trainer_trainees (status);

CREATE INDEX IF NOT EXISTS user_program_progress_week_started_idx
  ON user_program_progress (week_started_at)
  WHERE week_started_at IS NOT NULL;
