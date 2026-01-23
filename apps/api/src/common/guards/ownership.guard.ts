import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Ownership Verification Guard
 * Ensures users can only modify their own resources
 * Prevents horizontal privilege escalation
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admin and Owner can access all resources
    if (user.role === 'OWNER' || user.role === 'ADMIN') {
      return true;
    }

    // Extract resource type from controller/route
    const resourceType = this.getResourceType(context);

    // Verify ownership based on resource type
    const isOwner = await this.verifyOwnership(
      resourceType,
      resourceId,
      user.id,
    );

    if (!isOwner) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }

  /**
   * Determine resource type from controller name
   */
  private getResourceType(context: ExecutionContext): string {
    const controllerName = context.getClass().name.toLowerCase();

    if (controllerName.includes('user')) return 'user';
    if (controllerName.includes('post')) return 'post';
    if (controllerName.includes('project')) return 'project';
    if (controllerName.includes('comment')) return 'comment';
    if (controllerName.includes('course')) return 'course';
    if (controllerName.includes('chapter')) return 'chapter';

    return 'unknown';
  }

  /**
   * Verify user owns the resource
   */
  private async verifyOwnership(
    resourceType: string,
    resourceId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      switch (resourceType) {
        case 'user':
          return resourceId === userId;

        case 'post':
          const post = await this.prisma.post.findUnique({
            where: { id: resourceId },
          });
          return post?.authorId === userId;

        case 'project':
          const project = await this.prisma.project.findUnique({
            where: { id: resourceId },
          });
          return project?.leaderId === userId;

        case 'comment':
          const comment = await this.prisma.comment.findUnique({
            where: { id: resourceId },
          });
          return comment?.authorId === userId;

        case 'course':
          const course = await this.prisma.course.findUnique({
            where: { id: resourceId },
          });
          return course?.createdById === userId;

        case 'chapter':
          const chapter = await this.prisma.chapter.findUnique({
            where: { id: resourceId },
            include: { course: true },
          });
          return chapter?.course?.createdById === userId;

        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }
}
