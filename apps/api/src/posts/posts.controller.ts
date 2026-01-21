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
import { PostsService } from './posts.service'
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto'

/**
 * Posts Controller
 * Handles HTTP requests for post management
 * Clean Architecture: Controller -> Service -> Repository (Prisma)
 */
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
  async deletePost(@Param('id') id: string, @Req() req: any) {
    return this.postsService.delete(id, req.user.id)
  }
}
