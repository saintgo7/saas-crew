import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Integration Test: Community Interaction Flow
 * Tests posts, comments, votes, and best answer selection
 */
describe('Community Interaction Integration Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authorToken: string;
  let commenterToken: string;
  let authorId: string;
  let commenterId: string;
  let postId: string;
  let commentIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean up database
    await prisma.vote.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Cleanup
    await prisma.vote.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();
    
    await app.close();
  });

  describe('User Setup', () => {
    it('should create post author account', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'author@wku.ac.kr',
          password: 'Author123!',
          name: 'Post Author',
        })
        .expect(201);

      authorId = response.body.id;

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'author@wku.ac.kr',
          password: 'Author123!',
        })
        .expect(200);

      authorToken = loginResponse.body.access_token;
    });

    it('should create commenter account', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'commenter@wku.ac.kr',
          password: 'Commenter123!',
          name: 'Active Commenter',
        })
        .expect(201);

      commenterId = response.body.id;

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'commenter@wku.ac.kr',
          password: 'Commenter123!',
        })
        .expect(200);

      commenterToken = loginResponse.body.access_token;
    });
  });

  describe('Post Creation', () => {
    it('should create a question post', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          title: 'How to implement authentication in NestJS?',
          content: 'I am trying to implement JWT authentication in my NestJS application. What is the best approach?',
          category: 'question',
          tags: ['NestJS', 'Authentication', 'JWT'],
        })
        .expect(201);

      postId = response.body.id;
      
      expect(response.body).toMatchObject({
        title: 'How to implement authentication in NestJS?',
        authorId: authorId,
        category: 'question',
        upvotes: 0,
        downvotes: 0,
        viewCount: 0,
      });
      expect(response.body.tags).toContain('NestJS');
    });

    it('should increment view count when viewing post', async () => {
      // View as different user
      const response = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .expect(200);

      expect(response.body.viewCount).toBeGreaterThan(0);
    });

    it('should not increment view count for author viewing own post', async () => {
      const firstView = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      const viewCount1 = firstView.body.viewCount;

      const secondView = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      const viewCount2 = secondView.body.viewCount;

      // View count should not increase for same user
      expect(viewCount2).toBe(viewCount1);
    });
  });

  describe('Commenting Flow', () => {
    it('should add a comment to the post', async () => {
      const response = await request(app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({
          content: 'You should use @nestjs/passport with passport-jwt strategy. Here is an example...',
        })
        .expect(201);

      commentIds.push(response.body.id);
      
      expect(response.body).toMatchObject({
        content: expect.stringContaining('passport'),
        authorId: commenterId,
        postId: postId,
        upvotes: 0,
        isAccepted: false,
      });
    });

    it('should add multiple comments', async () => {
      const comments = [
        'Another approach is to use sessions instead of JWT.',
        'Make sure to hash passwords with bcrypt before storing them.',
        'Don\'t forget to implement refresh tokens for better security.',
      ];

      for (const content of comments) {
        const response = await request(app.getHttpServer())
          .post(`/posts/${postId}/comments`)
          .set('Authorization', `Bearer ${commenterToken}`)
          .send({ content })
          .expect(201);

        commentIds.push(response.body.id);
      }

      // Verify all comments exist
      const postResponse = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      expect(postResponse.body.comments.length).toBeGreaterThanOrEqual(4);
    });

    it('should allow editing own comment', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/comments/${commentIds[0]}`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({
          content: 'UPDATED: Use @nestjs/passport with passport-jwt. Here is a detailed example...',
        })
        .expect(200);

      expect(response.body.content).toContain('UPDATED');
      expect(response.body.edited).toBe(true);
    });

    it('should prevent editing others comments', async () => {
      await request(app.getHttpServer())
        .patch(`/comments/${commentIds[0]}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          content: 'Trying to edit someone else\'s comment',
        })
        .expect(403); // Forbidden
    });

    it('should allow replying to comments (nested comments)', async () => {
      const response = await request(app.getHttpServer())
        .post(`/comments/${commentIds[0]}/replies`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          content: 'Thanks for the suggestion! Could you provide more details?',
        })
        .expect(201);

      expect(response.body.parentId).toBe(commentIds[0]);
      expect(response.body.postId).toBe(postId);
    });
  });

  describe('Voting System', () => {
    it('should upvote a post', async () => {
      const response = await request(app.getHttpServer())
        .post(`/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({
          type: 'upvote',
        })
        .expect(201);

      expect(response.body.upvotes).toBe(1);
      expect(response.body.downvotes).toBe(0);
    });

    it('should upvote a comment', async () => {
      const response = await request(app.getHttpServer())
        .post(`/comments/${commentIds[0]}/vote`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          type: 'upvote',
        })
        .expect(201);

      expect(response.body.upvotes).toBe(1);
    });

    it('should prevent double voting', async () => {
      await request(app.getHttpServer())
        .post(`/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({
          type: 'upvote',
        })
        .expect(409); // Conflict - already voted
    });

    it('should allow changing vote from upvote to downvote', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({
          type: 'downvote',
        })
        .expect(200);

      expect(response.body.upvotes).toBe(0);
      expect(response.body.downvotes).toBe(1);
    });

    it('should allow removing vote', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .expect(200);

      const postResponse = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .expect(200);

      expect(postResponse.body.upvotes).toBe(0);
      expect(postResponse.body.downvotes).toBe(0);
    });

    it('should calculate vote score correctly', async () => {
      // Create multiple users and votes
      const voters = [];
      
      for (let i = 0; i < 5; i++) {
        const user = await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: `voter${i}@wku.ac.kr`,
            password: 'Voter123!',
            name: `Voter ${i}`,
          })
          .expect(201);

        const login = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: `voter${i}@wku.ac.kr`,
            password: 'Voter123!',
          })
          .expect(200);

        voters.push(login.body.access_token);
      }

      // 3 upvotes, 2 downvotes
      await request(app.getHttpServer())
        .post(`/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${voters[0]}`)
        .send({ type: 'upvote' })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${voters[1]}`)
        .send({ type: 'upvote' })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${voters[2]}`)
        .send({ type: 'upvote' })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${voters[3]}`)
        .send({ type: 'downvote' })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/posts/${postId}/vote`)
        .set('Authorization', `Bearer ${voters[4]}`)
        .send({ type: 'downvote' })
        .expect(201);

      const postResponse = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      expect(postResponse.body.upvotes).toBe(3);
      expect(postResponse.body.downvotes).toBe(2);
      expect(postResponse.body.score).toBe(1); // 3 - 2 = 1
    });
  });

  describe('Best Answer Selection', () => {
    it('should allow post author to mark comment as accepted answer', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/comments/${commentIds[0]}/accept`)
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      expect(response.body.isAccepted).toBe(true);
    });

    it('should prevent non-author from marking comment as accepted', async () => {
      await request(app.getHttpServer())
        .patch(`/comments/${commentIds[1]}/accept`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .expect(403); // Forbidden
    });

    it('should unmark previous accepted answer when selecting new one', async () => {
      // Mark second comment as accepted
      await request(app.getHttpServer())
        .patch(`/comments/${commentIds[1]}/accept`)
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      // First comment should no longer be accepted
      const comment1 = await prisma.comment.findUnique({
        where: { id: commentIds[0] },
      });

      expect(comment1?.isAccepted).toBe(false);

      // Second comment should be accepted
      const comment2 = await prisma.comment.findUnique({
        where: { id: commentIds[1] },
      });

      expect(comment2?.isAccepted).toBe(true);
    });

    it('should mark post as resolved when answer is accepted', async () => {
      const postResponse = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      expect(postResponse.body.hasAcceptedAnswer).toBe(true);
      expect(postResponse.body.resolved).toBe(true);
    });
  });

  describe('Deletion Cascade', () => {
    it('should delete comments when post is deleted', async () => {
      // Get comment count
      const commentsBefore = await prisma.comment.findMany({
        where: { postId },
      });

      expect(commentsBefore.length).toBeGreaterThan(0);

      // Delete post
      await request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      // Comments should be cascade deleted
      const commentsAfter = await prisma.comment.findMany({
        where: { postId },
      });

      expect(commentsAfter.length).toBe(0);
    });

    it('should delete votes when post is deleted', async () => {
      // Create new post with votes
      const newPost = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          title: 'Test Post for Cascade',
          content: 'Testing cascade deletion',
          category: 'general',
        })
        .expect(201);

      // Add vote
      await request(app.getHttpServer())
        .post(`/posts/${newPost.body.id}/vote`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({ type: 'upvote' })
        .expect(201);

      // Delete post
      await request(app.getHttpServer())
        .delete(`/posts/${newPost.body.id}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      // Votes should be cascade deleted
      const votes = await prisma.vote.findMany({
        where: { postId: newPost.body.id },
      });

      expect(votes.length).toBe(0);
    });

    it('should delete nested replies when parent comment is deleted', async () => {
      // Create post, comment, and reply
      const post = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          title: 'Test Nested Comments',
          content: 'Testing nested comment deletion',
          category: 'general',
        })
        .expect(201);

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .send({ content: 'Parent comment' })
        .expect(201);

      const reply = await request(app.getHttpServer())
        .post(`/comments/${comment.body.id}/replies`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ content: 'Nested reply' })
        .expect(201);

      // Delete parent comment
      await request(app.getHttpServer())
        .delete(`/comments/${comment.body.id}`)
        .set('Authorization', `Bearer ${commenterToken}`)
        .expect(200);

      // Reply should be deleted
      const replyAfter = await prisma.comment.findUnique({
        where: { id: reply.body.id },
      });

      expect(replyAfter).toBeNull();
    });
  });

  describe('Search and Filtering', () => {
    beforeAll(async () => {
      // Create various posts for searching
      const posts = [
        {
          title: 'React Hooks Tutorial',
          content: 'Learn React Hooks',
          category: 'tutorial',
          tags: ['React', 'Hooks'],
        },
        {
          title: 'NestJS Best Practices',
          content: 'Best practices for NestJS development',
          category: 'guide',
          tags: ['NestJS', 'Best Practices'],
        },
        {
          title: 'TypeScript Tips',
          content: 'Useful TypeScript tips and tricks',
          category: 'tips',
          tags: ['TypeScript'],
        },
      ];

      for (const post of posts) {
        await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', `Bearer ${authorToken}`)
          .send(post)
          .expect(201);
      }
    });

    it('should search posts by keyword', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts?search=React')
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.some((p: any) => p.title.includes('React'))).toBe(true);
    });

    it('should filter posts by category', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts?category=tutorial')
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      expect(response.body.every((p: any) => p.category === 'tutorial')).toBe(true);
    });

    it('should filter posts by tags', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts?tags=NestJS')
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      expect(response.body.some((p: any) => p.tags.includes('NestJS'))).toBe(true);
    });

    it('should sort posts by votes', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts?sort=votes')
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      // Posts should be sorted by vote score
      for (let i = 0; i < response.body.length - 1; i++) {
        expect(response.body[i].score).toBeGreaterThanOrEqual(
          response.body[i + 1].score,
        );
      }
    });

    it('should sort posts by recent activity', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts?sort=recent')
        .set('Authorization', `Bearer ${authorToken}`)
        .expect(200);

      // Posts should be sorted by creation date
      for (let i = 0; i < response.body.length - 1; i++) {
        const date1 = new Date(response.body[i].createdAt);
        const date2 = new Date(response.body[i + 1].createdAt);
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
      }
    });
  });
});
