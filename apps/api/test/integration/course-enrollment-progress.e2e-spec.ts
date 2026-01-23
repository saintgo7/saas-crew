import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestHelpers, TestUser } from '../test-helpers';

/**
 * Integration Test: Course-Enrollment-Progress Flow
 * Tests the complete learning journey from course creation to completion
 */
describe('Course-Enrollment-Progress Integration Flow (e2e)', () => {
  let app: INestApplication;
  let admin: TestUser;
  let student: TestUser;
  let courseId: string;
  let chapterIds: string[] = [];

  beforeAll(async () => {
    app = await TestHelpers.initApp();
  });

  beforeEach(async () => {
    await TestHelpers.cleanDatabase();
    chapterIds = [];

    admin = await TestHelpers.createTestUser({
      email: 'admin@example.com',
      name: 'Course Admin',
      rank: 'MASTER',
    });
    student = await TestHelpers.createTestUser({
      email: 'student@example.com',
      name: 'Learning Student',
      rank: 'JUNIOR',
    });
  });

  afterAll(async () => {
    await TestHelpers.cleanDatabase();
    await TestHelpers.closeApp();
  });

  describe('Course Creation and Setup', () => {
    it('should create a course', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/courses')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          title: 'Introduction to NestJS',
          slug: 'intro-to-nestjs',
          description: 'Learn NestJS from scratch',
          level: 'JUNIOR',
          duration: 120,
          tags: ['nestjs', 'backend', 'typescript'],
        })
        .expect(201);

      courseId = response.body.id;
      expect(courseId).toBeDefined();
      expect(response.body.title).toBe('Introduction to NestJS');
    });

    it('should add chapters to the course', async () => {
      const course = await TestHelpers.createTestCourse({
        title: 'Test Course',
        slug: 'test-course-chapters',
      });
      courseId = course.id;

      // Create chapter 1
      const chapter1 = await request(app.getHttpServer())
        .post(`/api/courses/${courseId}/chapters`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          title: 'Chapter 1: Getting Started',
          slug: 'chapter-1-getting-started',
          order: 1,
          content: 'Introduction content',
        })
        .expect(201);

      chapterIds.push(chapter1.body.id);

      // Create chapter 2
      const chapter2 = await request(app.getHttpServer())
        .post(`/api/courses/${courseId}/chapters`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          title: 'Chapter 2: Core Concepts',
          slug: 'chapter-2-core-concepts',
          order: 2,
          content: 'Core concepts content',
        })
        .expect(201);

      chapterIds.push(chapter2.body.id);
      expect(chapterIds).toHaveLength(2);
    });
  });

  describe('Student Enrollment', () => {
    it('should allow student to enroll in a course', async () => {
      const course = await TestHelpers.createTestCourse();
      courseId = course.id;

      const response = await request(app.getHttpServer())
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(201);

      expect(response.body.courseId).toBe(courseId);
      expect(response.body.userId).toBe(student.id);
    });

    it('should not allow duplicate enrollment', async () => {
      const course = await TestHelpers.createTestCourse();
      courseId = course.id;

      // First enrollment
      await request(app.getHttpServer())
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(201);

      // Duplicate enrollment should fail
      await request(app.getHttpServer())
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(409);
    });
  });

  describe('Learning Progress', () => {
    it('should track chapter completion', async () => {
      const course = await TestHelpers.createTestCourse();
      courseId = course.id;

      const chapter = await TestHelpers.createTestChapter(courseId);

      // Enroll first
      await request(app.getHttpServer())
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(201);

      // Mark chapter as complete
      const response = await request(app.getHttpServer())
        .post(`/api/chapters/${chapter.id}/complete`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(200);

      expect(response.body.completed).toBe(true);
    });

    it('should calculate course progress', async () => {
      const course = await TestHelpers.createTestCourse();
      courseId = course.id;

      const chapter1 = await TestHelpers.createTestChapter(courseId, { order: 1 });
      const chapter2 = await TestHelpers.createTestChapter(courseId, { order: 2, slug: 'ch2' });

      // Enroll
      await request(app.getHttpServer())
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(201);

      // Complete first chapter
      await request(app.getHttpServer())
        .post(`/api/chapters/${chapter1.id}/complete`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(200);

      // Check progress (should be 50%)
      const progressResponse = await request(app.getHttpServer())
        .get(`/api/courses/${courseId}/progress`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(200);

      expect(progressResponse.body.progress).toBe(50);
    });
  });

  describe('Course Completion', () => {
    it('should mark course as completed when all chapters done', async () => {
      const course = await TestHelpers.createTestCourse();
      courseId = course.id;

      const chapter = await TestHelpers.createTestChapter(courseId);

      // Enroll
      await request(app.getHttpServer())
        .post(`/api/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(201);

      // Complete the only chapter
      await request(app.getHttpServer())
        .post(`/api/chapters/${chapter.id}/complete`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(200);

      // Check progress (should be 100%)
      const progressResponse = await request(app.getHttpServer())
        .get(`/api/courses/${courseId}/progress`)
        .set('Authorization', `Bearer ${student.token}`)
        .expect(200);

      expect(progressResponse.body.progress).toBe(100);
    });
  });
});
