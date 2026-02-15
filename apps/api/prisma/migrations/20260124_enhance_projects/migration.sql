-- Project Enhancement Migration
-- Adds team invitation system, activity logging, and enhanced GitHub integration

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ProjectActivityType" AS ENUM (
  'PROJECT_CREATED',
  'PROJECT_UPDATED',
  'PROJECT_DELETED',
  'MEMBER_JOINED',
  'MEMBER_LEFT',
  'MEMBER_REMOVED',
  'MEMBER_ROLE_CHANGED',
  'INVITATION_SENT',
  'INVITATION_ACCEPTED',
  'INVITATION_REJECTED',
  'INVITATION_CANCELLED',
  'GITHUB_SYNCED',
  'GITHUB_CONNECTED',
  'GITHUB_DISCONNECTED'
);

-- AlterTable: Add GitHub integration fields to projects
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "githubOwner" TEXT;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "githubDefaultBranch" TEXT;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "githubStars" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "githubForks" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "lastSyncAt" TIMESTAMP(3);

-- CreateTable: project_invitations
CREATE TABLE IF NOT EXISTS "project_invitations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "email" TEXT,
    "userId" TEXT,
    "inviterId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL DEFAULT 'MEMBER',
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: project_activities
CREATE TABLE IF NOT EXISTS "project_activities" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "type" "ProjectActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: project_invitations indexes
CREATE UNIQUE INDEX IF NOT EXISTS "project_invitations_token_key" ON "project_invitations"("token");
CREATE INDEX IF NOT EXISTS "project_invitations_projectId_idx" ON "project_invitations"("projectId");
CREATE INDEX IF NOT EXISTS "project_invitations_email_idx" ON "project_invitations"("email");
CREATE INDEX IF NOT EXISTS "project_invitations_userId_idx" ON "project_invitations"("userId");
CREATE INDEX IF NOT EXISTS "project_invitations_token_idx" ON "project_invitations"("token");
CREATE INDEX IF NOT EXISTS "project_invitations_status_idx" ON "project_invitations"("status");

-- CreateIndex: project_activities indexes
CREATE INDEX IF NOT EXISTS "project_activities_projectId_createdAt_idx" ON "project_activities"("projectId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "project_activities_actorId_idx" ON "project_activities"("actorId");

-- AddForeignKey: project_invitations -> projects
ALTER TABLE "project_invitations" DROP CONSTRAINT IF EXISTS "project_invitations_projectId_fkey";
ALTER TABLE "project_invitations" ADD CONSTRAINT "project_invitations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: project_activities -> projects
ALTER TABLE "project_activities" DROP CONSTRAINT IF EXISTS "project_activities_projectId_fkey";
ALTER TABLE "project_activities" ADD CONSTRAINT "project_activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
