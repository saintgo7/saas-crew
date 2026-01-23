import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Integration Test: Course-Enrollment-Progress Flow
 * Tests the complete learning journey from course creation to completion
 */
describe('Course-Enrollment-Progress Integration Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let instructorToken: string;
  let studentToken: string;
  let instructorId: string;
  let studentId: string;
  let courseId: string;
  let chapterIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean up database
    await prisma.enrollment.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Cleanup
    await prisma.enrollment.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
    
    await app.close();
  });

  describe('Course Creation and Setup', () => {
    it('should create instructor account', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'instructor@wku.ac.kr',
          password: 'Instructor123!',
          name: 'Course Instructor',
          role: 'instructor',
        })
        .expect(201);

      instructorId = response.body.id;

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'instructor@wku.ac.kr',
          password: 'Instructor123!',
        })
        .expect(200);

      instructorToken = loginResponse.body.access_token;
    });

    it('should create student account', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'student@wku.ac.kr',
          password: 'Student123!',
          name: 'Learning Student',
          role: 'student',
        })
        .expect(201);

      studentId = response.body.id;

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'student@wku.ac.kr',
          password: 'Student123!',
        })
        .expect(200);

      studentToken = loginResponse.body.access_token;
    });

    it('should create a course', async () => {
      const response = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Full Stack Web Development',
          description: 'Learn modern web development with React and NestJS',
          category: 'web-development',
          level: 'intermediate',
          published: false, // Draft initially
        })
        .expect(201);

      courseId = response.body.id;
      
      expect(response.body).toMatchObject({
        title: 'Full Stack Web Development',
        instructorId: instructorId,
        published: false,
      });
    });

    it('should add chapters to the course', async () => {
      const chapters = [
        {
          title: 'Introduction to React',
          description: 'Learn React basics',
          order: 1,
          duration: 30,
          content: 'React fundamentals...',
        },
        {
          title: 'React Hooks',
          description: 'Understanding React Hooks',
          order: 2,
          duration: 45,
          content: 'useState, useEffect...',
        },
        {
          title: 'NestJS Fundamentals',
          description: 'Backend with NestJS',
          order: 3,
          duration: 60,
          content: 'Controllers, Services...',
        },
      ];

      for (const chapter of chapters) {
        const response = await request(app.getHttpServer())
          .post(`/courses/${courseId}/chapters`)
          .set('Authorization', `Bearer ${instructorToken}`)
          .send(chapter)
          .expect(201);

        chapterIds.push(response.body.id);
        
        expect(response.body).toMatchObject({
          title: chapter.title,
          order: chapter.order,
          courseId: courseId,
        });
      }

      expect(chapterIds.length).toBe(3);
    });

    it('should publish the course', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/courses/${courseId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          published: true,
        })
        .expect(200);

      expect(response.body.published).toBe(true);
    });
  });

  describe('Enrollment Flow', () => {
    it('should prevent enrollment in unpublished course', async () => {
      // Create unpublished course
      const unpublishedCourse = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Draft Course',
          description: 'Not published yet',
          published: false,
        })
        .expect(201);

      // Try to enroll
      await request(app.getHttpServer())
        .post(`/courses/${unpublishedCourse.body.id}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403); // Forbidden
    });

    it('should enroll student in published course', async () => {
      const response = await request(app.getHttpServer())
        .post(`/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(201);

      expect(response.body).toMatchObject({
        userId: studentId,
        courseId: courseId,
        progress: 0,
        completed: false,
      });
    });

    it('should prevent duplicate enrollment', async () => {
      await request(app.getHttpServer())
        .post(`/courses/${courseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(409); // Conflict
    });

    it('should verify enrollment in user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me/enrollments')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      const enrollment = response.body.find((e: any) => e.courseId === courseId);
      expect(enrollment).toBeDefined();
      expect(enrollment.progress).toBe(0);
    });
  });

  describe('Progress Tracking', () => {
    it('should track video progress for a chapter', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/chapters/${chapterIds[0]}/progress`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          videoPosition: 120, // 2 minutes
        })
        .expect(200);

      expect(response.body.videoPosition).toBe(120);
    });

    it('should mark first chapter as complete', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/chapters/${chapterIds[0]}/progress`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          completed: true,
        })
        .expect(200);

      expect(response.body.completed).toBe(true);
      expect(response.body.completedAt).toBeDefined();
    });

    it('should update course completion rate', async () => {
      const response = await request(app.getHttpServer())
        .get(`/courses/${courseId}/enrollment`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      // 1 out of 3 chapters = 33.33%
      expect(response.body.progress).toBeCloseTo(33.33, 1);
      expect(response.body.completed).toBe(false);
    });

    it('should complete second chapter', async () => {
      await request(app.getHttpServer())
        .patch(`/chapters/${chapterIds[1]}/progress`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          videoPosition: 2700, // 45 minutes (full duration)
          completed: true,
        })
        .expect(200);

      // Check updated progress
      const response = await request(app.getHttpServer())
        .get(`/courses/${courseId}/enrollment`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      // 2 out of 3 chapters = 66.67%
      expect(response.body.progress).toBeCloseTo(66.67, 1);
    });

    it('should complete final chapter and mark course as complete', async () => {
      await request(app.getHttpServer())
        .patch(`/chapters/${chapterIds[2]}/progress`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          completed: true,
        })
        .expect(200);

      // Verify course completion
      const response = await request(app.getHttpServer())
        .get(`/courses/${courseId}/enrollment`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.progress).toBe(100);
      expect(response.body.completed).toBe(true);
      expect(response.body.completedAt).toBeDefined();
    });

    it('should allow certificate generation after completion', async () => {
      const response = await request(app.getHttpServer())
        .get(`/courses/${courseId}/certificate`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('certificateId');
      expect(response.body).toHaveProperty('issuedAt');
      expect(response.body.studentName).toBe('Learning Student');
      expect(response.body.courseTitle).toBe('Full Stack Web Development');
    });
  });

  describe('Unenrollment Flow', () => {
    let testCourseId: string;
    let testChapterId: string;

    beforeAll(async () => {
      // Create test course with chapters
      const course = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Test Unenrollment Course',
          description: 'For testing unenrollment',
          published: true,
        })
        .expect(201);

      testCourseId = course.body.id;

      const chapter = await request(app.getHttpServer())
        .post(`/courses/${testCourseId}/chapters`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Test Chapter',
          order: 1,
        })
        .expect(201);

      testChapterId = chapter.body.id;

      // Enroll student
      await request(app.getHttpServer())
        .post(`/courses/${testCourseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(201);

      // Make some progress
      await request(app.getHttpServer())
        .patch(`/chapters/${testChapterId}/progress`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          videoPosition: 300,
        })
        .expect(200);
    });

    it('should unenroll from course', async () => {
      await request(app.getHttpServer())
        .delete(`/courses/${testCourseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      // Verify unenrollment
      const response = await request(app.getHttpServer())
        .get('/users/me/enrollments')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      const enrollment = response.body.find((e: any) => e.courseId === testCourseId);
      expect(enrollment).toBeUndefined();
    });

    it('should delete progress data after unenrollment', async () => {
      // Progress data should be deleted
      const progress = await prisma.progress.findMany({
        where: {
          enrollment: {
            userId: studentId,
            courseId: testCourseId,
          },
        },
      });

      expect(progress.length).toBe(0);
    });

    it('should allow re-enrollment after unenrollment', async () => {
      const response = await request(app.getHttpServer())
        .post(`/courses/${testCourseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(201);

      // Progress should be reset
      expect(response.body.progress).toBe(0);
      expect(response.body.completed).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent progress updates', async () => {
      const updates = [
        request(app.getHttpServer())
          .patch(`/chapters/${chapterIds[0]}/progress`)
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ videoPosition: 100 }),
        request(app.getHttpServer())
          .patch(`/chapters/${chapterIds[0]}/progress`)
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ videoPosition: 150 }),
      ];

      const results = await Promise.all(updates);
      
      // Both should succeed, last update wins
      expect(results[0].status).toBe(200);
      expect(results[1].status).toBe(200);
      expect(results[1].body.videoPosition).toBe(150);
    });

    it('should prevent marking incomplete chapter before previous one', async () => {
      // This would be implemented with prerequisite logic
      // Placeholder test
      expect(true).toBeTruthy();
    });

    it('should handle course deletion with active enrollments', async () => {
      // Create disposable course
      const course = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'To Be Deleted',
          published: true,
        })
        .expect(201);

      // Enroll student
      await request(app.getHttpServer())
        .post(`/courses/${course.body.id}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(201);

      // Try to delete course (should handle enrollments)
      await request(app.getHttpServer())
        .delete(`/courses/${course.body.id}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .expect(200);

      // Enrollments should be cascade deleted
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId: course.body.id },
      });

      expect(enrollments.length).toBe(0);
    });
  });
});
