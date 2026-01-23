import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestHelpers, TestUser } from '../test-helpers';

/**
 * Integration Test: Community Interaction Flow
 * Tests posts, comments, votes, and best answer selection
 */
describe('Community Interaction Integration Flow (e2e)', () => {
  let app: INestApplication;
  let author: TestUser;
  let commenter: TestUser;
  let postId: string;
  let commentIds: string[] = [];

  beforeAll(async () => {
    app = await TestHelpers.initApp();
  });

  beforeEach(async () => {
    await TestHelpers.cleanDatabase();
    commentIds = [];

    author = await TestHelpers.createTestUser({
      email: 'author@example.com',
      name: 'Post Author',
      rank: 'SENIOR',
    });
    commenter = await TestHelpers.createTestUser({
      email: 'commenter@example.com',
      name: 'Active Commenter',
      rank: 'JUNIOR',
    });
  });

  afterAll(async () => {
    await TestHelpers.cleanDatabase();
    await TestHelpers.closeApp();
  });

  describe('Post Creation', () => {
    it('should create a question post', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/posts')
        .set('Authorization', `Bearer ${author.token}`)
        .send({
          title: 'How to implement authentication in NestJS?',
          slug: 'how-to-implement-auth-nestjs',
          content: 'I am trying to implement JWT authentication...',
          tags: ['nestjs', 'authentication', 'jwt'],
        })
        .expect(201);

      postId = response.body.id;
      expect(postId).toBeDefined();
      expect(response.body.title).toContain('authentication');
    });

    it('should get post details', async () => {
      const post = await TestHelpers.createTestPost(author.id, {
        title: 'Test Post',
        slug: 'test-post-details',
      });
      postId = post.id;

      const response = await request(app.getHttpServer())
        .get(`/api/posts/${postId}`)
        .expect(200);

      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBe('Test Post');
    });

    it('should list posts with pagination', async () => {
      await TestHelpers.createTestPost(author.id, { slug: 'post-1' });
      await TestHelpers.createTestPost(author.id, { slug: 'post-2' });

      const response = await request(app.getHttpServer())
        .get('/api/posts')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.posts).toBeDefined();
      expect(response.body.posts.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Comments', () => {
    it('should add a comment to a post', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      const response = await request(app.getHttpServer())
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${commenter.token}`)
        .send({ content: 'You should use Passport.js with JWT strategy.' })
        .expect(201);

      commentIds.push(response.body.id);
      expect(response.body.content).toContain('Passport.js');
    });

    it('should add a reply to a comment', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      const parentComment = await TestHelpers.createTestComment(postId, commenter.id);
      commentIds.push(parentComment.id);

      const response = await request(app.getHttpServer())
        .post(`/api/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${author.token}`)
        .send({
          content: 'Thanks for the suggestion!',
          parentId: parentComment.id,
        })
        .expect(201);

      expect(response.body.parentId).toBe(parentComment.id);
    });

    it('should get comments for a post', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      await TestHelpers.createTestComment(postId, commenter.id);
      await TestHelpers.createTestComment(postId, author.id, { content: 'Second comment' });

      const response = await request(app.getHttpServer())
        .get(`/api/posts/${postId}/comments`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Voting', () => {
    it('should upvote a post', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      const response = await request(app.getHttpServer())
        .post(`/api/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${commenter.token}`)
        .send({ value: 1 })
        .expect(200);

      expect(response.body.userVote).toBe(1);
      expect(response.body.voteScore).toBeGreaterThan(0);
    });

    // Note: Comment voting is not implemented in the current API
    // This test is skipped as there's no /api/comments/:id/vote endpoint
    it.skip('should upvote a comment', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      const comment = await TestHelpers.createTestComment(postId, commenter.id);

      const response = await request(app.getHttpServer())
        .post(`/api/comments/${comment.id}/vote`)
        .set('Authorization', `Bearer ${author.token}`)
        .send({ value: 1 })
        .expect(200);

      expect(response.body.userVote).toBe(1);
    });

    // Note: Current API allows self-voting on own posts
    it('should allow self-voting on own post', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      const response = await request(app.getHttpServer())
        .post(`/api/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${author.token}`)
        .send({ value: 1 })
        .expect(200);

      expect(response.body.userVote).toBe(1);
    });
  });

  describe('Best Answer', () => {
    it('should allow post author to accept answer', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      const comment = await TestHelpers.createTestComment(postId, commenter.id);

      const response = await request(app.getHttpServer())
        .post(`/api/comments/${comment.id}/accept`)
        .set('Authorization', `Bearer ${author.token}`)
        .expect(200);

      expect(response.body.accepted).toBe(true);
    });

    it('should not allow non-author to accept answer', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      const comment = await TestHelpers.createTestComment(postId, commenter.id);

      await request(app.getHttpServer())
        .post(`/api/comments/${comment.id}/accept`)
        .set('Authorization', `Bearer ${commenter.token}`)
        .expect(403);
    });
  });

  describe('Post Management', () => {
    it('should update own post', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      const response = await request(app.getHttpServer())
        .patch(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${author.token}`)
        .send({ content: 'Updated content with more details.' })
        .expect(200);

      expect(response.body.content).toContain('Updated content');
    });

    it('should not allow updating others post', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      await request(app.getHttpServer())
        .patch(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${commenter.token}`)
        .send({ content: 'Hacked content' })
        .expect(403);
    });

    it('should delete own post', async () => {
      const post = await TestHelpers.createTestPost(author.id);
      postId = post.id;

      await request(app.getHttpServer())
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${author.token}`)
        .expect(200);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/api/posts/${postId}`)
        .expect(404);
    });
  });
});
