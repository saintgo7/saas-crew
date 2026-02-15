-- Quiz and Certificate System Migration
-- Adds quiz functionality and course completion certificates

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'SHORT_ANSWER');

-- CreateTable: quizzes
CREATE TABLE IF NOT EXISTS "quizzes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "chapterId" TEXT NOT NULL,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "timeLimit" INTEGER,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable: quiz_questions
CREATE TABLE IF NOT EXISTS "quiz_questions" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: quiz_attempts
CREATE TABLE IF NOT EXISTS "quiz_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "timeSpent" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable: certificates
CREATE TABLE IF NOT EXISTS "certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "courseName" TEXT NOT NULL,
    "courseLevel" TEXT NOT NULL,
    "verificationUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: quizzes
CREATE INDEX IF NOT EXISTS "quizzes_chapterId_idx" ON "quizzes"("chapterId");

-- CreateIndex: quiz_questions
CREATE INDEX IF NOT EXISTS "quiz_questions_quizId_order_idx" ON "quiz_questions"("quizId", "order");

-- CreateIndex: quiz_attempts
CREATE INDEX IF NOT EXISTS "quiz_attempts_userId_quizId_idx" ON "quiz_attempts"("userId", "quizId");
CREATE INDEX IF NOT EXISTS "quiz_attempts_quizId_idx" ON "quiz_attempts"("quizId");

-- CreateIndex: certificates
CREATE UNIQUE INDEX IF NOT EXISTS "certificates_certificateNumber_key" ON "certificates"("certificateNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "certificates_userId_courseId_key" ON "certificates"("userId", "courseId");
CREATE INDEX IF NOT EXISTS "certificates_userId_idx" ON "certificates"("userId");
CREATE INDEX IF NOT EXISTS "certificates_certificateNumber_idx" ON "certificates"("certificateNumber");

-- AddForeignKey: quizzes -> chapters
ALTER TABLE "quizzes" DROP CONSTRAINT IF EXISTS "quizzes_chapterId_fkey";
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: quiz_questions -> quizzes
ALTER TABLE "quiz_questions" DROP CONSTRAINT IF EXISTS "quiz_questions_quizId_fkey";
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: quiz_attempts -> quizzes
ALTER TABLE "quiz_attempts" DROP CONSTRAINT IF EXISTS "quiz_attempts_quizId_fkey";
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
