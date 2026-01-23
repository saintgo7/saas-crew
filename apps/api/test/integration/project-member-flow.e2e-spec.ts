import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestHelpers, TestUser } from '../test-helpers';

/**
 * Integration Test: Project-Member Flow
 * Tests the complete flow of project creation, member management, and deletion
 */
describe('Project-Member Integration Flow (e2e)', () => {
  let app: INestApplication;
  let owner: TestUser;
  let member: TestUser;
  let projectId: string;

  beforeAll(async () => {
    app = await TestHelpers.initApp();
  });

  beforeEach(async () => {
    await TestHelpers.cleanDatabase();
    owner = await TestHelpers.createTestUser({
      email: 'owner@example.com',
      name: 'Project Owner',
      rank: 'SENIOR',
    });
    member = await TestHelpers.createTestUser({
      email: 'member@example.com',
      name: 'Team Member',
      rank: 'JUNIOR',
    });
  });

  afterAll(async () => {
    await TestHelpers.cleanDatabase();
    await TestHelpers.closeApp();
  });

  describe('Project Creation and Member Management', () => {
    it('should create a project', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/projects')
        .set('Authorization', `Bearer ${owner.token}`)
        .send({
          name: 'Full Stack SaaS Platform',
          slug: 'full-stack-saas',
          description: 'Building a SaaS platform with React and NestJS',
          visibility: 'PUBLIC',
          tags: ['react', 'nestjs', 'typescript'],
        })
        .expect(201);

      projectId = response.body.id;
      expect(projectId).toBeDefined();
      expect(response.body.name).toBe('Full Stack SaaS Platform');
    });

    it('should get project details', async () => {
      const project = await TestHelpers.createTestProject(owner.id, {
        name: 'Test Project',
        slug: 'test-project',
      });
      projectId = project.id;

      const response = await request(app.getHttpServer())
        .get(`/api/projects/${projectId}`)
        .expect(200);

      expect(response.body.id).toBe(projectId);
      expect(response.body.name).toBe('Test Project');
    });

    it('should add member to project', async () => {
      const project = await TestHelpers.createTestProject(owner.id);
      projectId = project.id;

      const response = await request(app.getHttpServer())
        .post(`/api/projects/${projectId}/members`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ userId: member.id, role: 'MEMBER' })
        .expect(201);

      expect(response.body.userId).toBe(member.id);
      expect(response.body.role).toBe('MEMBER');
    });

    it('should not allow non-owner to add members', async () => {
      const project = await TestHelpers.createTestProject(owner.id);
      projectId = project.id;

      await request(app.getHttpServer())
        .post(`/api/projects/${projectId}/members`)
        .set('Authorization', `Bearer ${member.token}`)
        .send({ userId: member.id, role: 'MEMBER' })
        .expect(403);
    });

    it('should remove member from project', async () => {
      const project = await TestHelpers.createTestProject(owner.id);
      projectId = project.id;

      // Add member first
      await request(app.getHttpServer())
        .post(`/api/projects/${projectId}/members`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ userId: member.id, role: 'MEMBER' })
        .expect(201);

      // Remove member
      await request(app.getHttpServer())
        .delete(`/api/projects/${projectId}/members/${member.id}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);
    });

    it('should update project details', async () => {
      const project = await TestHelpers.createTestProject(owner.id);
      projectId = project.id;

      const response = await request(app.getHttpServer())
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({
          description: 'Updated description',
        })
        .expect(200);

      expect(response.body.description).toBe('Updated description');
    });

    it('should delete project', async () => {
      const project = await TestHelpers.createTestProject(owner.id);
      projectId = project.id;

      await request(app.getHttpServer())
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${owner.token}`)
        .expect(200);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/api/projects/${projectId}`)
        .expect(404);
    });
  });
});
