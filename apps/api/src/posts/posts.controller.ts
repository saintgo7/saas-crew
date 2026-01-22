import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger'
import { PostsService } from './posts.service'
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto'

/**
 * Posts Controller
 * Handles HTTP requests for post management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /api/posts
   * Get all posts with optional filters
   * Public endpoint - supports filtering by tags, search, pagination
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Retrieve posts with optional filtering, search, and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
  })
  async getPosts(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query)
  }

  /**
   * POST /api/posts
   * Create a new post
   * Protected endpoint - requires JWT authentication
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create post',
    description: 'Create a new community post',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async createPost(@Req() req: any, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.id, dto)
  }

  /**
   * GET /api/posts/:id
   * Get post details by ID with comments and votes
   * Public endpoint - increments view count
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieve detailed post information including comments and votes. Increments view count.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '345e6789-e01b-23d4-a567-426614174444',
  })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async getPost(@Param('id') id: string) {
    return this.postsService.findById(id)
  }

  /**
   * PATCH /api/posts/:id
   * Update post information
   * Protected endpoint - requires JWT authentication (Author only)
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update post',
    description: 'Update post information. Only the author can update the post.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '345e6789-e01b-23d4-a567-426614174444',
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only author can update',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async updatePost(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, req.user.id, dto)
  }

  /**
   * DELETE /api/posts/:id
   * Delete post
   * Protected endpoint - requires JWT authentication (Author only)
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete post',
    description: 'Delete a post. Only the author can delete the post.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    example: '345e6789-e01b-23d4-a567-426614174444',
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only author can delete',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async deletePost(@Param('id') id: string, @Req() req: any) {
    return this.postsService.delete(id, req.user.id)
  }
}
