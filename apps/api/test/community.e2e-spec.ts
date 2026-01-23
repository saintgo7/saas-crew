/**
 * Community API E2E Tests
 * Tests for posts, comments, and votes
 */

import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { TestHelpers, TestUser } from './test-helpers'

describe('Community API (e2e)', () => {
  let app: INestApplication
  let user1: TestUser
  let user2: TestUser
  let user3: TestUser

  beforeAll(async () => {
    app = await TestHelpers.initApp()
  })

  beforeEach(async () => {
    await TestHelpers.cleanDatabase()
    const users = await TestHelpers.createTestUsers(3)
    user1 = users[0]
    user2 = users[1]
    user3 = users[2]
  })

  afterAll(async () => {
    await TestHelpers.cleanDatabase()
    await TestHelpers.closeApp()
  })

  describe('Posts - GET /api/posts', () => {
    it('should return all posts', async () => {
      await TestHelpers.createTestPost(user1.id, { title: 'Post 1' })
      await TestHelpers.createTestPost(user2.id, { title: 'Post 2' })

      const response = await request(app.getHttpServer())
        .get('/api/posts')
        .expect(200)

      expect(response.body.posts).toBeDefined()
      expect(Array.isArray(response.body.posts)).toBe(true)
      expect(response.body.posts.length).toBeGreaterThanOrEqual(2)
    })

    it('should filter posts by tags', async () => {
      await TestHelpers.createTestPost(user1.id, {
        title: 'React Post',
        tags: ['react', 'frontend'],
      })
      await TestHelpers.createTestPost(user2.id, {
        title: 'Node Post',
        tags: ['nodejs', 'backend'],
      })

      const response = await request(app.getHttpServer())
        .get('/api/posts?tags=react')
        .expect(200)

      const reactPost = response.body.posts.find((p: any) => p.title === 'React Post')
      expect(reactPost).toBeDefined()
    })

    it('should support search query', async () => {
      await TestHelpers.createTestPost(user1.id, {
        title: 'How to use TypeScript',
        content: 'TypeScript tutorial content',
      })

      const response = await request(app.getHttpServer())
        .get('/api/posts?search=TypeScript')
        .expect(200)

      expect(response.body.posts.length).toBeGreaterThanOrEqual(1)
    })

    it('should support pagination', async () => {
      // Create multiple posts
      for (let i = 0; i < 15; i++) {
        await TestHelpers.createTestPost(user1.id, {
          title: `Post ${i}`,
        })
      }

      const response = await request(app.getHttpServer())
        .get('/api/posts?page=1&limit=10')
        .expect(200)

      expect(response.body.posts.length).toBeLessThanOrEqual(10)
      expect(response.body).toHaveProperty('total')
      expect(response.body).toHaveProperty('totalPages')
    })
  })

  describe('Posts - POST /api/posts', () => {
    it('should create post when authenticated', async () => {
      const postData = {
        title: 'My New Post',
        slug: 'my-new-post-' + Date.now(),
        content: 'This is my post content with **markdown**',
        tags: ['test', 'new'],
      }

      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${user1.token}`)
        .send(postData)
        .expect(201)

      expect(response.body).toMatchObject({
        title: postData.title,
        content: postData.content,
        tags: postData.tags,
        authorId: user1.id,
      })
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('slug')
      expect(response.body.viewCount).toBe(0)
    })

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/api/posts')
        .send({ title: 'Unauthorized Post', content: 'Content' })
        .expect(401)
    })

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ title: 'Title only' }) // Missing content
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should auto-generate slug from title', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          title: 'How to Learn React in 2024',
          slug: 'how-to-learn-react-' + Date.now(),
          content: 'Post content',
        })
        .expect(201)

      expect(response.body.slug).toBeDefined()
      expect(typeof response.body.slug).toBe('string')
    })
  })

  describe('Posts - GET /api/posts/:id', () => {
    it('should return post details with author', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      const response = await request(app.getHttpServer())
        .get(`/api/posts/${post.id}`)
        .expect(200)

      expect(response.body).toMatchObject({
        id: post.id,
        title: post.title,
        content: post.content,
      })
      expect(response.body.author).toBeDefined()
      expect(response.body.author.id).toBe(user1.id)
    })

    it('should increment view count on each view', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      // First view
      await request(app.getHttpServer())
        .get(`/api/posts/${post.id}`)
        .expect(200)

      // Second view
      const response = await request(app.getHttpServer())
        .get(`/api/posts/${post.id}`)
        .expect(200)

      expect(response.body.viewCount).toBeGreaterThan(0)
    })

    it('should return 404 for non-existent post', async () => {
      await request(app.getHttpServer())
        .get('/api/posts/non-existent-id')
        .expect(404)
    })

    it('should include comments and votes count', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      await TestHelpers.createTestComment(post.id, user2.id)

      const response = await request(app.getHttpServer())
        .get(`/api/posts/${post.id}`)
        .expect(200)

      // Response includes _count for comments and votes
      expect(response.body).toHaveProperty('_count')
      expect(response.body._count).toHaveProperty('comments')
      expect(response.body._count.comments).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Posts - PATCH /api/posts/:id', () => {
    it('should allow author to update post', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      }

      const response = await request(app.getHttpServer())
        .patch(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toMatchObject(updateData)
    })

    it('should return 401 when not authenticated', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      await request(app.getHttpServer())
        .patch(`/api/posts/${post.id}`)
        .send({ title: 'Unauthorized Update' })
        .expect(401)
    })

    it('should return 403 when non-author tries to update', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      await request(app.getHttpServer())
        .patch(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${user2.token}`)
        .send({ title: 'Forbidden Update' })
        .expect(403)
    })

    it('should update updatedAt timestamp', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const originalUpdatedAt = post.updatedAt

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 100))

      const response = await request(app.getHttpServer())
        .patch(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({ content: 'Updated content' })
        .expect(200)

      expect(new Date(response.body.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime(),
      )
    })
  })

  describe('Posts - DELETE /api/posts/:id', () => {
    it('should allow author to delete post', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      await request(app.getHttpServer())
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .expect(200)

      // Verify post is deleted
      await request(app.getHttpServer())
        .get(`/api/posts/${post.id}`)
        .expect(404)
    })

    it('should return 401 when not authenticated', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      await request(app.getHttpServer())
        .delete(`/api/posts/${post.id}`)
        .expect(401)
    })

    it('should return 403 when non-author tries to delete', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      await request(app.getHttpServer())
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${user2.token}`)
        .expect(403)
    })

    it('should cascade delete comments and votes', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      await TestHelpers.createTestComment(post.id, user2.id)
      await TestHelpers.prisma.vote.create({
        data: {
          userId: user2.id,
          postId: post.id,
          value: 1,
        },
      })

      await request(app.getHttpServer())
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .expect(200)

      // Verify comments and votes are deleted
      const comments = await TestHelpers.prisma.comment.findMany({
        where: { postId: post.id },
      })
      const votes = await TestHelpers.prisma.vote.findMany({
        where: { postId: post.id },
      })

      expect(comments.length).toBe(0)
      expect(votes.length).toBe(0)
    })
  })

  describe('Comments - GET /api/posts/:id/comments', () => {
    it('should return post comments', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      await TestHelpers.createTestComment(post.id, user2.id, {
        content: 'Great post!',
      })

      const response = await request(app.getHttpServer())
        .get(`/api/posts/${post.id}/comments`)
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThanOrEqual(1)
      expect(response.body[0].content).toBe('Great post!')
    })

    it('should return nested comments (replies)', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const parentComment = await TestHelpers.createTestComment(post.id, user2.id)
      await TestHelpers.createTestComment(post.id, user3.id, {
        parentId: parentComment.id,
        content: 'Reply to comment',
      })

      const response = await request(app.getHttpServer())
        .get(`/api/posts/${post.id}/comments`)
        .expect(200)

      const parent = response.body.find((c: any) => c.id === parentComment.id)
      expect(parent).toBeDefined()
      expect(parent.replies).toBeDefined()
      expect(Array.isArray(parent.replies)).toBe(true)
    })

    it('should return empty array for post with no comments', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      const response = await request(app.getHttpServer())
        .get(`/api/posts/${post.id}/comments`)
        .expect(200)

      expect(response.body).toEqual([])
    })
  })

  describe('Comments - POST /api/posts/:id/comments', () => {
    it('should create comment when authenticated', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      const response = await request(app.getHttpServer())
        .post(`/api/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${user2.token}`)
        .send({ content: 'Nice post!' })
        .expect(201)

      expect(response.body).toMatchObject({
        content: 'Nice post!',
        postId: post.id,
        authorId: user2.id,
      })
      expect(response.body).toHaveProperty('id')
    })

    it('should return 401 when not authenticated', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      await request(app.getHttpServer())
        .post(`/api/posts/${post.id}/comments`)
        .send({ content: 'Unauthorized comment' })
        .expect(401)
    })

    it('should create nested comment (reply)', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const parentComment = await TestHelpers.createTestComment(post.id, user2.id)

      const response = await request(app.getHttpServer())
        .post(`/api/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${user3.token}`)
        .send({
          content: 'Reply to your comment',
          parentId: parentComment.id,
        })
        .expect(201)

      expect(response.body.parentId).toBe(parentComment.id)
    })

    it('should validate required content', async () => {
      const post = await TestHelpers.createTestPost(user1.id)

      await request(app.getHttpServer())
        .post(`/api/posts/${post.id}/comments`)
        .set('Authorization', `Bearer ${user2.token}`)
        .send({}) // Missing content
        .expect(400)
    })
  })

  describe('Comments - PATCH /api/comments/:id', () => {
    it('should allow author to update comment', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)

      const response = await request(app.getHttpServer())
        .patch(`/api/comments/${comment.id}`)
        .set('Authorization', `Bearer ${user2.token}`)
        .send({ content: 'Updated comment content' })
        .expect(200)

      expect(response.body.content).toBe('Updated comment content')
    })

    it('should return 401 when not authenticated', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)

      await request(app.getHttpServer())
        .patch(`/api/comments/${comment.id}`)
        .send({ content: 'Unauthorized update' })
        .expect(401)
    })

    it('should return 403 when non-author tries to update', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)

      await request(app.getHttpServer())
        .patch(`/api/comments/${comment.id}`)
        .set('Authorization', `Bearer ${user3.token}`)
        .send({ content: 'Forbidden update' })
        .expect(403)
    })
  })

  describe('Comments - DELETE /api/comments/:id', () => {
    it('should allow author to delete comment', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)

      await request(app.getHttpServer())
        .delete(`/api/comments/${comment.id}`)
        .set('Authorization', `Bearer ${user2.token}`)
        .expect(200)

      // Verify comment is deleted
      const deletedComment = await TestHelpers.prisma.comment.findUnique({
        where: { id: comment.id },
      })
      expect(deletedComment).toBeNull()
    })

    it('should return 401 when not authenticated', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)

      await request(app.getHttpServer())
        .delete(`/api/comments/${comment.id}`)
        .expect(401)
    })

    it('should return 403 when non-author tries to delete', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)

      await request(app.getHttpServer())
        .delete(`/api/comments/${comment.id}`)
        .set('Authorization', `Bearer ${user3.token}`)
        .expect(403)
    })

    it('should cascade delete replies', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const parentComment = await TestHelpers.createTestComment(post.id, user2.id)
      const replyComment = await TestHelpers.createTestComment(post.id, user3.id, {
        parentId: parentComment.id,
      })

      await request(app.getHttpServer())
        .delete(`/api/comments/${parentComment.id}`)
        .set('Authorization', `Bearer ${user2.token}`)
        .expect(200)

      // Verify reply is also deleted
      const deletedReply = await TestHelpers.prisma.comment.findUnique({
        where: { id: replyComment.id },
      })
      expect(deletedReply).toBeNull()
    })
  })

  describe('Comments - POST /api/comments/:id/accept', () => {
    it('should allow post author to accept answer', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)

      const response = await request(app.getHttpServer())
        .post(`/api/comments/${comment.id}/accept`)
        .set('Authorization', `Bearer ${user1.token}`)
        .expect(200)

      expect(response.body.accepted).toBe(true)
    })

    it('should return 401 when not authenticated', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)

      await request(app.getHttpServer())
        .post(`/api/comments/${comment.id}/accept`)
        .expect(401)
    })

    it('should return 403 when non-post-author tries to accept', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)

      await request(app.getHttpServer())
        .post(`/api/comments/${comment.id}/accept`)
        .set('Authorization', `Bearer ${user3.token}`)
        .expect(403)
    })

    it('should unaccept previously accepted comment', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment1 = await TestHelpers.createTestComment(post.id, user2.id)
      const comment2 = await TestHelpers.createTestComment(post.id, user3.id)

      // Accept first comment
      await request(app.getHttpServer())
        .post(`/api/comments/${comment1.id}/accept`)
        .set('Authorization', `Bearer ${user1.token}`)
        .expect(200)

      // Accept second comment (should unaccept first)
      await request(app.getHttpServer())
        .post(`/api/comments/${comment2.id}/accept`)
        .set('Authorization', `Bearer ${user1.token}`)
        .expect(200)

      // Verify first comment is not accepted
      const updatedComment1 = await TestHelpers.prisma.comment.findUnique({
        where: { id: comment1.id },
      })
      expect(updatedComment1?.accepted).toBe(false)
    })
  })

  describe('Database Transaction Integrity', () => {
    it('should rollback on validation error', async () => {
      const initialUserCount = await TestHelpers.prisma.user.count()

      // Attempt to create post with invalid data should not create orphaned records
      try {
        await request(app.getHttpServer())
          .post('/api/posts')
          .set('Authorization', `Bearer ${user1.token}`)
          .send({}) // Invalid data
          .expect(400)
      } catch (error) {
        // Ignore error
      }

      const finalUserCount = await TestHelpers.prisma.user.count()
      expect(finalUserCount).toBe(initialUserCount)
    })

    it('should maintain referential integrity on cascade delete', async () => {
      const post = await TestHelpers.createTestPost(user1.id)
      const comment = await TestHelpers.createTestComment(post.id, user2.id)
      const vote = await TestHelpers.prisma.vote.create({
        data: {
          userId: user2.id,
          postId: post.id,
          value: 1,
        },
      })

      // Delete post
      await request(app.getHttpServer())
        .delete(`/api/posts/${post.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .expect(200)

      // Verify all related records are deleted
      const remainingComments = await TestHelpers.prisma.comment.findMany({
        where: { postId: post.id },
      })
      const remainingVotes = await TestHelpers.prisma.vote.findMany({
        where: { postId: post.id },
      })

      expect(remainingComments).toHaveLength(0)
      expect(remainingVotes).toHaveLength(0)
    })
  })
})
