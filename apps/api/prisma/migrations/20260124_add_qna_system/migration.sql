-- CreateEnum
CREATE TYPE "XpActivityType" AS ENUM ('POST_CREATED', 'ANSWER_CREATED', 'ANSWER_ACCEPTED', 'VOTE_RECEIVED', 'RESOURCE_SHARED', 'COURSE_COMPLETED', 'CHAPTER_COMPLETED', 'DAILY_LOGIN', 'STREAK_BONUS', 'MENTOR_BONUS');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_QUESTION', 'NEW_ANSWER', 'ANSWER_ACCEPTED', 'NEW_FOLLOWER', 'MENTION', 'VOTE_RECEIVED', 'LEVEL_UP', 'RANK_UP', 'XP_GAINED', 'MENTOR_ASSIGNED', 'MENTEE_ASSIGNED', 'MENTOR_MESSAGE');

-- CreateEnum
CREATE TYPE "MentorshipStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('OPEN', 'ANSWERED', 'CLOSED');

-- CreateTable
CREATE TABLE "xp_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "XpActivityType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "actorId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorships" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "status" "MentorshipStatus" NOT NULL DEFAULT 'PENDING',
    "sessionsCount" INTEGER NOT NULL DEFAULT 0,
    "lastSessionAt" TIMESTAMP(3),
    "mentorRating" DOUBLE PRECISION,
    "menteeRating" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentorships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "status" "QuestionStatus" NOT NULL DEFAULT 'OPEN',
    "acceptedAnswerId" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "answerCount" INTEGER NOT NULL DEFAULT 0,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "bounty" INTEGER NOT NULL DEFAULT 0,
    "bountyExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT,
    "answerId" TEXT,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "xp_activities_userId_idx" ON "xp_activities"("userId");

-- CreateIndex
CREATE INDEX "xp_activities_type_idx" ON "xp_activities"("type");

-- CreateIndex
CREATE INDEX "xp_activities_createdAt_idx" ON "xp_activities"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "mentorships_mentorId_idx" ON "mentorships"("mentorId");

-- CreateIndex
CREATE INDEX "mentorships_menteeId_idx" ON "mentorships"("menteeId");

-- CreateIndex
CREATE INDEX "mentorships_status_idx" ON "mentorships"("status");

-- CreateIndex
CREATE UNIQUE INDEX "mentorships_mentorId_menteeId_key" ON "mentorships"("mentorId", "menteeId");

-- CreateIndex
CREATE UNIQUE INDEX "questions_acceptedAnswerId_key" ON "questions"("acceptedAnswerId");

-- CreateIndex
CREATE INDEX "questions_authorId_idx" ON "questions"("authorId");

-- CreateIndex
CREATE INDEX "questions_status_idx" ON "questions"("status");

-- CreateIndex
CREATE INDEX "questions_tags_idx" ON "questions" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "questions_createdAt_idx" ON "questions"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "answers_questionId_idx" ON "answers"("questionId");

-- CreateIndex
CREATE INDEX "answers_authorId_idx" ON "answers"("authorId");

-- CreateIndex
CREATE INDEX "answers_voteCount_idx" ON "answers"("voteCount" DESC);

-- CreateIndex
CREATE INDEX "question_votes_questionId_idx" ON "question_votes"("questionId");

-- CreateIndex
CREATE INDEX "question_votes_answerId_idx" ON "question_votes"("answerId");

-- CreateIndex
CREATE UNIQUE INDEX "question_votes_userId_questionId_key" ON "question_votes"("userId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "question_votes_userId_answerId_key" ON "question_votes"("userId", "answerId");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_acceptedAnswerId_fkey" FOREIGN KEY ("acceptedAnswerId") REFERENCES "answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

