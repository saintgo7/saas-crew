-- CreateTable
CREATE TABLE "post_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("id")
);

-- Add categoryId and isPinned to posts
ALTER TABLE "posts" ADD COLUMN "categoryId" TEXT;
ALTER TABLE "posts" ADD COLUMN "isPinned" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "post_categories_name_key" ON "post_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "post_categories_slug_key" ON "post_categories"("slug");

-- CreateIndex
CREATE INDEX "post_categories_slug_idx" ON "post_categories"("slug");

-- CreateIndex
CREATE INDEX "post_categories_order_idx" ON "post_categories"("order");

-- CreateIndex
CREATE INDEX "comment_likes_commentId_idx" ON "comment_likes"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_likes_userId_commentId_key" ON "comment_likes"("userId", "commentId");

-- CreateIndex
CREATE INDEX "posts_categoryId_idx" ON "posts"("categoryId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "post_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default categories
INSERT INTO "post_categories" ("id", "name", "slug", "description", "icon", "color", "order", "updatedAt")
VALUES
    ('cat_general', '일반', 'general', '자유롭게 이야기를 나눠보세요', 'message-circle', '#6B7280', 1, NOW()),
    ('cat_tech', '기술', 'tech', '기술 관련 토론 및 정보 공유', 'code', '#3B82F6', 2, NOW()),
    ('cat_project', '프로젝트', 'project', '프로젝트 소개 및 팀원 모집', 'folder', '#10B981', 3, NOW()),
    ('cat_career', '취업/진로', 'career', '취업 정보 및 진로 상담', 'briefcase', '#F59E0B', 4, NOW()),
    ('cat_study', '스터디', 'study', '스터디 모집 및 학습 자료 공유', 'book-open', '#8B5CF6', 5, NOW()),
    ('cat_notice', '공지', 'notice', '동아리 공지사항', 'megaphone', '#EF4444', 0, NOW());
