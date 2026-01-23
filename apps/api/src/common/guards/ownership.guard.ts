import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRank } from '@prisma/client';

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

    // Master rank users can access all resources
    if (user.rank === UserRank.MASTER) {
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
          // Check if user is OWNER of the project through ProjectMember
          const projectMember = await this.prisma.projectMember.findFirst({
            where: {
              projectId: resourceId,
              userId: userId,
              role: 'OWNER',
            },
          });
          return !!projectMember;

        case 'comment':
          const comment = await this.prisma.comment.findUnique({
            where: { id: resourceId },
          });
          return comment?.authorId === userId;

        case 'course':
          // Courses are admin-managed; allow MASTER rank users only
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
          });
          return user?.rank === UserRank.MASTER;

        case 'chapter':
          // Chapters follow the same rule as courses
          const chapterUser = await this.prisma.user.findUnique({
            where: { id: userId },
          });
          return chapterUser?.rank === UserRank.MASTER;

        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }
}
