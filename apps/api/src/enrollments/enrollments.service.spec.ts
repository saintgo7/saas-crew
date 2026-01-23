import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from './entities/enrollment.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let enrollmentRepository: Repository<Enrollment>;
  let courseRepository: Repository<Course>;

  const mockEnrollmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
    })),
  };

  const mockCourseRepository = {
    findOne: jest.fn(),
  };

  const mockUser: Partial<User> = {
    id: '1',
    email: 'student@wku.ac.kr',
    name: 'Test Student',
  };

  const mockCourse: Partial<Course> = {
    id: '1',
    title: 'Test Course',
    description: 'Test Description',
    isPublished: true,
    instructorId: '2',
  };

  const mockEnrollment: Partial<Enrollment> = {
    id: '1',
    userId: '1',
    courseId: '1',
    enrolledAt: new Date(),
    progress: 0,
    completed: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: getRepositoryToken(Enrollment),
          useValue: mockEnrollmentRepository,
        },
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    enrollmentRepository = module.get<Repository<Enrollment>>(
      getRepositoryToken(Enrollment),
    );
    courseRepository = module.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('enroll', () => {
    it('should successfully enroll a user in a course', async () => {
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      mockEnrollmentRepository.create.mockReturnValue(mockEnrollment);
      mockEnrollmentRepository.save.mockResolvedValue(mockEnrollment);

      const result = await service.enroll('1', '1');

      expect(result).toEqual(mockEnrollment);
      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockEnrollmentRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when course does not exist', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);

      await expect(service.enroll('1', '999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when already enrolled', async () => {
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);

      await expect(service.enroll('1', '1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ForbiddenException when enrolling in unpublished course', async () => {
      const unpublishedCourse = { ...mockCourse, isPublished: false };
      mockCourseRepository.findOne.mockResolvedValue(unpublishedCourse);
      mockEnrollmentRepository.findOne.mockResolvedValue(null);

      await expect(service.enroll('1', '1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow instructor to enroll in own course', async () => {
      const instructorCourse = { ...mockCourse, instructorId: '1' };
      mockCourseRepository.findOne.mockResolvedValue(instructorCourse);
      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      mockEnrollmentRepository.create.mockReturnValue(mockEnrollment);
      mockEnrollmentRepository.save.mockResolvedValue(mockEnrollment);

      const result = await service.enroll('1', '1');

      expect(result).toEqual(mockEnrollment);
    });
  });

  describe('unenroll', () => {
    it('should successfully unenroll a user from a course', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
      mockEnrollmentRepository.delete.mockResolvedValue({ affected: 1 });

      await service.unenroll('1', '1');

      expect(mockEnrollmentRepository.delete).toHaveBeenCalledWith({
        userId: '1',
        courseId: '1',
      });
    });

    it('should throw NotFoundException when enrollment does not exist', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(null);

      await expect(service.unenroll('1', '999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle deletion failure gracefully', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
      mockEnrollmentRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.unenroll('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findUserEnrollments', () => {
    it('should return all enrollments for a user', async () => {
      const enrollments = [mockEnrollment, { ...mockEnrollment, id: '2' }];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(enrollments),
      };
      mockEnrollmentRepository.createQueryBuilder.mockReturnValue(
        queryBuilder,
      );

      const result = await service.findUserEnrollments('1');

      expect(result).toEqual(enrollments);
      expect(queryBuilder.where).toHaveBeenCalledWith('enrollment.userId = :userId', {
        userId: '1',
      });
    });

    it('should filter enrollments by completion status', async () => {
      const completedEnrollments = [
        { ...mockEnrollment, completed: true },
      ];
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(completedEnrollments),
      };
      mockEnrollmentRepository.createQueryBuilder.mockReturnValue(
        queryBuilder,
      );

      const result = await service.findUserEnrollments('1', { completed: true });

      expect(result).toEqual(completedEnrollments);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'enrollment.completed = :completed',
        { completed: true },
      );
    });

    it('should return empty array when user has no enrollments', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockEnrollmentRepository.createQueryBuilder.mockReturnValue(
        queryBuilder,
      );

      const result = await service.findUserEnrollments('999');

      expect(result).toEqual([]);
    });
  });

  describe('findEnrollment', () => {
    it('should return enrollment when it exists', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);

      const result = await service.findEnrollment('1', '1');

      expect(result).toEqual(mockEnrollment);
      expect(mockEnrollmentRepository.findOne).toHaveBeenCalledWith({
        where: { userId: '1', courseId: '1' },
      });
    });

    it('should return null when enrollment does not exist', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(null);

      const result = await service.findEnrollment('1', '999');

      expect(result).toBeNull();
    });
  });

  describe('updateProgress', () => {
    it('should update enrollment progress', async () => {
      const updatedEnrollment = { ...mockEnrollment, progress: 50 };
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
      mockEnrollmentRepository.save.mockResolvedValue(updatedEnrollment);

      const result = await service.updateProgress('1', '1', 50);

      expect(result.progress).toBe(50);
      expect(mockEnrollmentRepository.save).toHaveBeenCalled();
    });

    it('should mark enrollment as completed when progress reaches 100', async () => {
      const completedEnrollment = {
        ...mockEnrollment,
        progress: 100,
        completed: true,
        completedAt: expect.any(Date),
      };
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
      mockEnrollmentRepository.save.mockResolvedValue(completedEnrollment);

      const result = await service.updateProgress('1', '1', 100);

      expect(result.progress).toBe(100);
      expect(result.completed).toBe(true);
      expect(result.completedAt).toBeDefined();
    });

    it('should throw NotFoundException when enrollment does not exist', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(null);

      await expect(service.updateProgress('1', '999', 50)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not allow progress to exceed 100', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
      
      await expect(service.updateProgress('1', '1', 150)).rejects.toThrow();
    });

    it('should not allow negative progress', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);
      
      await expect(service.updateProgress('1', '1', -10)).rejects.toThrow();
    });
  });

  describe('getCourseEnrollmentCount', () => {
    it('should return enrollment count for a course', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(42),
      };
      mockEnrollmentRepository.createQueryBuilder.mockReturnValue(
        queryBuilder,
      );

      const result = await service.getCourseEnrollmentCount('1');

      expect(result).toBe(42);
      expect(queryBuilder.where).toHaveBeenCalledWith('enrollment.courseId = :courseId', {
        courseId: '1',
      });
    });

    it('should return 0 when course has no enrollments', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      };
      mockEnrollmentRepository.createQueryBuilder.mockReturnValue(
        queryBuilder,
      );

      const result = await service.getCourseEnrollmentCount('999');

      expect(result).toBe(0);
    });
  });

  describe('isEnrolled', () => {
    it('should return true when user is enrolled', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(mockEnrollment);

      const result = await service.isEnrolled('1', '1');

      expect(result).toBe(true);
    });

    it('should return false when user is not enrolled', async () => {
      mockEnrollmentRepository.findOne.mockResolvedValue(null);

      const result = await service.isEnrolled('1', '999');

      expect(result).toBe(false);
    });
  });

  describe('bulkEnroll', () => {
    it('should enroll multiple users in a course', async () => {
      const userIds = ['1', '2', '3'];
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.findOne.mockResolvedValue(null);
      mockEnrollmentRepository.create.mockImplementation((data) => data);
      mockEnrollmentRepository.save.mockImplementation((enrollment) => 
        Promise.resolve({ ...enrollment, id: Math.random().toString() })
      );

      const result = await service.bulkEnroll(userIds, '1');

      expect(result).toHaveLength(3);
      expect(mockEnrollmentRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should skip users already enrolled', async () => {
      const userIds = ['1', '2', '3'];
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockEnrollmentRepository.findOne
        .mockResolvedValueOnce(mockEnrollment) // User 1 already enrolled
        .mockResolvedValueOnce(null)           // User 2 not enrolled
        .mockResolvedValueOnce(null);          // User 3 not enrolled
      mockEnrollmentRepository.create.mockImplementation((data) => data);
      mockEnrollmentRepository.save.mockImplementation((enrollment) => 
        Promise.resolve({ ...enrollment, id: Math.random().toString() })
      );

      const result = await service.bulkEnroll(userIds, '1');

      expect(result).toHaveLength(2); // Only 2 users enrolled
      expect(mockEnrollmentRepository.save).toHaveBeenCalledTimes(2);
    });
  });
});
