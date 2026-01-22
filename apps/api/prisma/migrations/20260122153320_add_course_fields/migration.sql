-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "prerequisites" TEXT[],
ADD COLUMN     "topics" TEXT[];

-- CreateIndex
CREATE INDEX "courses_featured_createdAt_idx" ON "courses"("featured" DESC, "createdAt" DESC);

-- CreateIndex
CREATE INDEX "courses_tags_idx" ON "courses" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "courses_category_order_idx" ON "courses"("category", "order");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "posts_tags_idx" ON "posts" USING GIN ("tags");
