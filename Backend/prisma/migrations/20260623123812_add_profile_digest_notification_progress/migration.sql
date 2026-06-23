/*
  Warnings:

  - You are about to drop the column `training_session_id` on the `challenge_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `embedding` on the `exercises` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('TEMPLATE', 'ADAPTIVE');

-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('STRENGTH', 'FAT_LOSS', 'ENDURANCE', 'GENERAL_FITNESS');

-- CreateEnum
CREATE TYPE "TrainerTraineeSource" AS ENUM ('INVITE', 'MARKETPLACE_UPGRADE');

-- CreateEnum
CREATE TYPE "TrainerTraineeStatus" AS ENUM ('PENDING', 'ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "DigestStatus" AS ENUM ('PENDING_AUTO', 'AUTO_APPLIED', 'PENDING_TRAINER', 'TRAINER_DONE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RED_GROUP_ALERT', 'WEEKLY_DIGEST_AUTO', 'WEEKLY_DIGEST_PENDING', 'PROGRAM_ADJUSTED', 'TRAINER_NOTE', 'CHALLENGE_RESULT', 'INVITE_RECEIVED', 'UPGRADE_CONFIRMED');

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'ONEONONE_UPGRADE';

-- DropForeignKey
ALTER TABLE "challenge_sessions" DROP CONSTRAINT "challenge_sessions_training_session_id_fkey";

-- DropForeignKey
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "program_exercises" DROP CONSTRAINT "program_exercises_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "user_programs" DROP CONSTRAINT "user_programs_program_id_fkey";

-- AlterTable
ALTER TABLE "challenge_sessions" DROP COLUMN "training_session_id";

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "embedding";

-- AlterTable
ALTER TABLE "program_exercises" ADD COLUMN     "progressions" JSONB;

-- AlterTable
ALTER TABLE "training_programs" ADD COLUMN     "is_system_template" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "program_type" "ProgramType" NOT NULL DEFAULT 'TEMPLATE',
ADD COLUMN     "sessions_per_week" INTEGER,
ALTER COLUMN "trainer_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "goal" "Goal" DEFAULT 'GENERAL_FITNESS',
    "has_pull_up_bar" BOOLEAN NOT NULL DEFAULT false,
    "has_parallel_bars" BOOLEAN NOT NULL DEFAULT false,
    "injuries" JSONB,
    "trainer_bio" TEXT,
    "trainer_speciality" VARCHAR(255),
    "trainer_1on1_price" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_trainees" (
    "id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "trainee_id" INTEGER NOT NULL,
    "source" "TrainerTraineeSource" NOT NULL,
    "status" "TrainerTraineeStatus" NOT NULL DEFAULT 'PENDING',
    "invite_token" VARCHAR(255),
    "invited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activated_at" TIMESTAMP(3),

    CONSTRAINT "trainer_trainees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_program_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "program_id" INTEGER NOT NULL,
    "current_week" INTEGER NOT NULL DEFAULT 1,
    "current_day" INTEGER NOT NULL DEFAULT 1,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_session_at" TIMESTAMP(3),
    "week_started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_program_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_digests" (
    "id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "trainee_id" INTEGER NOT NULL,
    "program_id" INTEGER NOT NULL,
    "week_number" INTEGER NOT NULL,
    "avg_form_scores" JSONB NOT NULL,
    "ai_analysis" TEXT NOT NULL,
    "adjustments" JSONB NOT NULL,
    "status" "DigestStatus" NOT NULL DEFAULT 'PENDING_AUTO',
    "trainer_reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_digests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "payload" JSONB NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "trainer_trainees_invite_token_key" ON "trainer_trainees"("invite_token");

-- CreateIndex
CREATE INDEX "trainer_trainees_trainer_id_idx" ON "trainer_trainees"("trainer_id");

-- CreateIndex
CREATE INDEX "trainer_trainees_trainee_id_idx" ON "trainer_trainees"("trainee_id");

-- CreateIndex
CREATE UNIQUE INDEX "trainer_trainees_trainer_id_trainee_id_key" ON "trainer_trainees"("trainer_id", "trainee_id");

-- CreateIndex
CREATE INDEX "user_program_progress_user_id_idx" ON "user_program_progress"("user_id");

-- CreateIndex
CREATE INDEX "user_program_progress_program_id_idx" ON "user_program_progress"("program_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_program_progress_user_id_program_id_key" ON "user_program_progress"("user_id", "program_id");

-- CreateIndex
CREATE INDEX "weekly_digests_trainer_id_status_idx" ON "weekly_digests"("trainer_id", "status");

-- CreateIndex
CREATE INDEX "weekly_digests_trainee_id_program_id_idx" ON "weekly_digests"("trainee_id", "program_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");

-- CreateIndex
CREATE INDEX "training_programs_program_type_idx" ON "training_programs"("program_type");

-- CreateIndex
CREATE INDEX "training_programs_is_system_template_idx" ON "training_programs"("is_system_template");

-- CreateIndex
CREATE INDEX "training_sessions_exercise_id_idx" ON "training_sessions"("exercise_id");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_trainees" ADD CONSTRAINT "trainer_trainees_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_trainees" ADD CONSTRAINT "trainer_trainees_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_exercises" ADD CONSTRAINT "program_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_programs" ADD CONSTRAINT "user_programs_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "training_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_program_progress" ADD CONSTRAINT "user_program_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_program_progress" ADD CONSTRAINT "user_program_progress_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "training_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_digests" ADD CONSTRAINT "weekly_digests_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_digests" ADD CONSTRAINT "weekly_digests_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_digests" ADD CONSTRAINT "weekly_digests_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "training_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
