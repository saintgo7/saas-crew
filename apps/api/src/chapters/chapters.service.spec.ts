import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChaptersService } from './chapters.service';
import { Chapter } from './entities/chapter.entity';
import { Course } from '../courses/entities/course.entity';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('ChaptersService', () => {
  let service: ChaptersService;
  let chapterRepository: Repository<Chapter>;
  let courseRepository: Repository<Course>;

  const mockChapterRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    })),
  };

  const mockCourseRepository = {
    findOne: jest.fn(),
  };

  const mockCourse: Partial<Course> = {
    id: '1',
    title: 'Test Course',
    instructorId: '1',
  };

  const mockChapter: Partial<Chapter> = {
    id: '1',
    courseId: '1',
    title: 'Chapter 1',
    description: 'Introduction',
    order: 1,
    duration: 30,
    videoUrl: 'https://example.com/video.mp4',
    content: 'Chapter content',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaptersService,
        {
          provide: getRepositoryToken(Chapter),
          useValue: mockChapterRepository,
        },
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
      ],
    }).compile();

    service = module.get<ChaptersService>(ChaptersService);
    chapterRepository = module.get<Repository<Chapter>>(
      getRepositoryToken(Chapter),
    );
    courseRepository = module.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createChapterDto = {
      courseId: '1',
      title: 'New Chapter',
      description: 'Chapter description',
      order: 2,
      duration: 45,
      videoUrl: 'https://example.com/video2.mp4',
      content: 'Chapter content',
    };

    it('should successfully create a chapter', async () => {
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockChapterRepository.create.mockReturnValue(mockChapter);
      mockChapterRepository.save.mockResolvedValue(mockChapter);

      const result = await service.create(createChapterDto, '1');

      expect(result).toEqual(mockChapter);
      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockChapterRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when course does not exist', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createChapterDto, '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not the instructor', async () => {
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);

      await expect(service.create(createChapterDto, '999')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should auto-increment order when not provided', async () => {
      const dtoWithoutOrder = { ...createChapterDto };
      delete dtoWithoutOrder.order;

      const existingChapters = [
        { ...mockChapter, order: 1 },
        { ...mockChapter, id: '2', order: 2 },
      ];

      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockChapterRepository.find.mockResolvedValue(existingChapters);
      mockChapterRepository.create.mockImplementation((data) => ({
        ...data,
        order: 3,
      }));
      mockChapterRepository.save.mockImplementation((chapter) =>
        Promise.resolve(chapter),
      );

      const result = await service.create(dtoWithoutOrder, '1');

      expect(result.order).toBe(3);
    });

    it('should validate order is positive', async () => {
      const invalidDto = { ...createChapterDto, order: -1 };
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);

      await expect(service.create(invalidDto, '1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    const updateChapterDto = {
      title: 'Updated Chapter',
      description: 'Updated description',
      duration: 60,
    };

    it('should successfully update a chapter', async () => {
      const updatedChapter = { ...mockChapter, ...updateChapterDto };
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockChapterRepository.save.mockResolvedValue(updatedChapter);

      const result = await service.update('1', updateChapterDto, '1');

      expect(result).toEqual(updatedChapter);
      expect(mockChapterRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when chapter does not exist', async () => {
      mockChapterRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', updateChapterDto, '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not the instructor', async () => {
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);

      await expect(service.update('1', updateChapterDto, '999')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow partial updates', async () => {
      const partialUpdate = { title: 'Only Title Updated' };
      const updatedChapter = { ...mockChapter, title: 'Only Title Updated' };

      mockChapterRepository.findOne.mockResolvedValue(mockChapter);
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockChapterRepository.save.mockResolvedValue(updatedChapter);

      const result = await service.update('1', partialUpdate, '1');

      expect(result.title).toBe('Only Title Updated');
      expect(result.description).toBe(mockChapter.description);
    });
  });

  describe('delete', () => {
    it('should successfully delete a chapter', async () => {
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockChapterRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete('1', '1');

      expect(mockChapterRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when chapter does not exist', async () => {
      mockChapterRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('999', '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not the instructor', async () => {
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);

      await expect(service.delete('1', '999')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should reorder remaining chapters after deletion', async () => {
      const chapters = [
        { ...mockChapter, id: '1', order: 1 },
        { ...mockChapter, id: '2', order: 2 },
        { ...mockChapter, id: '3', order: 3 },
      ];

      mockChapterRepository.findOne.mockResolvedValue(chapters[1]); // Delete chapter 2
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockChapterRepository.delete.mockResolvedValue({ affected: 1 });
      mockChapterRepository.find.mockResolvedValue([chapters[0], chapters[2]]);

      await service.delete('2', '1');

      expect(mockChapterRepository.find).toHaveBeenCalled();
    });
  });

  describe('findByCourseId', () => {
    it('should return chapters ordered by order field', async () => {
      const chapters = [
        { ...mockChapter, id: '1', order: 1 },
        { ...mockChapter, id: '2', order: 2 },
        { ...mockChapter, id: '3', order: 3 },
      ];

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(chapters),
      };
      mockChapterRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findByCourseId('1');

      expect(result).toEqual(chapters);
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('chapter.order', 'ASC');
    });

    it('should return empty array when course has no chapters', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockChapterRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findByCourseId('999');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a chapter by id', async () => {
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);

      const result = await service.findOne('1');

      expect(result).toEqual(mockChapter);
      expect(mockChapterRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException when chapter does not exist', async () => {
      mockChapterRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('reorder', () => {
    it('should reorder chapters', async () => {
      const chapters = [
        { ...mockChapter, id: '1', order: 1 },
        { ...mockChapter, id: '2', order: 2 },
        { ...mockChapter, id: '3', order: 3 },
      ];

      const newOrder = ['3', '1', '2']; // New order

      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockChapterRepository.find.mockResolvedValue(chapters);
      mockChapterRepository.save.mockImplementation((chapter) =>
        Promise.resolve(chapter),
      );

      await service.reorder('1', newOrder, '1');

      expect(mockChapterRepository.save).toHaveBeenCalledTimes(3);
    });

    it('should throw NotFoundException when course does not exist', async () => {
      mockCourseRepository.findOne.mockResolvedValue(null);

      await expect(service.reorder('999', ['1', '2'], '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not the instructor', async () => {
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);

      await expect(service.reorder('1', ['1', '2'], '999')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should validate all chapters belong to the course', async () => {
      const chapters = [
        { ...mockChapter, id: '1', order: 1, courseId: '1' },
        { ...mockChapter, id: '2', order: 2, courseId: '2' }, // Different course
      ];

      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockChapterRepository.find.mockResolvedValue(chapters);

      await expect(service.reorder('1', ['1', '2'], '1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getChapterCount', () => {
    it('should return the number of chapters in a course', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(5),
      };
      mockChapterRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getChapterCount('1');

      expect(result).toBe(5);
    });

    it('should return 0 when course has no chapters', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      };
      mockChapterRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.getChapterCount('999');

      expect(result).toBe(0);
    });
  });

  describe('getTotalDuration', () => {
    it('should calculate total duration of all chapters', async () => {
      const chapters = [
        { ...mockChapter, duration: 30 },
        { ...mockChapter, id: '2', duration: 45 },
        { ...mockChapter, id: '3', duration: 60 },
      ];

      mockChapterRepository.find.mockResolvedValue(chapters);

      const result = await service.getTotalDuration('1');

      expect(result).toBe(135); // 30 + 45 + 60
    });

    it('should return 0 when course has no chapters', async () => {
      mockChapterRepository.find.mockResolvedValue([]);

      const result = await service.getTotalDuration('999');

      expect(result).toBe(0);
    });

    it('should handle chapters without duration', async () => {
      const chapters = [
        { ...mockChapter, duration: 30 },
        { ...mockChapter, id: '2', duration: null },
        { ...mockChapter, id: '3', duration: 45 },
      ];

      mockChapterRepository.find.mockResolvedValue(chapters);

      const result = await service.getTotalDuration('1');

      expect(result).toBe(75); // 30 + 0 + 45
    });
  });

  describe('duplicate', () => {
    it('should duplicate a chapter', async () => {
      const newChapter = { ...mockChapter, id: '2', title: 'Copy of Chapter 1' };
      
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);
      mockChapterRepository.create.mockReturnValue(newChapter);
      mockChapterRepository.save.mockResolvedValue(newChapter);

      const result = await service.duplicate('1', '1');

      expect(result.title).toContain('Copy of');
      expect(mockChapterRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when chapter does not exist', async () => {
      mockChapterRepository.findOne.mockResolvedValue(null);

      await expect(service.duplicate('999', '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not the instructor', async () => {
      mockChapterRepository.findOne.mockResolvedValue(mockChapter);
      mockCourseRepository.findOne.mockResolvedValue(mockCourse);

      await expect(service.duplicate('1', '999')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
