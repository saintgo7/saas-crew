-- CreateTable
CREATE TABLE "canvases" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "projectId" TEXT,
    "ownerId" TEXT NOT NULL,
    "data" JSONB,
    "thumbnail" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canvases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvas_members" (
    "id" TEXT NOT NULL,
    "canvasId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canvas_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "canvases_ownerId_idx" ON "canvases"("ownerId");

-- CreateIndex
CREATE INDEX "canvases_projectId_idx" ON "canvases"("projectId");

-- CreateIndex
CREATE INDEX "canvases_isPublic_idx" ON "canvases"("isPublic");

-- CreateIndex
CREATE INDEX "canvases_createdAt_idx" ON "canvases"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "canvas_members_userId_idx" ON "canvas_members"("userId");

-- CreateIndex
CREATE INDEX "canvas_members_canvasId_idx" ON "canvas_members"("canvasId");

-- CreateIndex
CREATE UNIQUE INDEX "canvas_members_canvasId_userId_key" ON "canvas_members"("canvasId", "userId");

-- AddForeignKey
ALTER TABLE "canvases" ADD CONSTRAINT "canvases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvases" ADD CONSTRAINT "canvases_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_members" ADD CONSTRAINT "canvas_members_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_members" ADD CONSTRAINT "canvas_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
