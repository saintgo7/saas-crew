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
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ProjectsService } from './projects.service'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { ProjectQueryDto } from './dto/project-query.dto'

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // 프로젝트 목록 (필터링)
  @Get()
  async getProjects(@Query() query: ProjectQueryDto) {
    return this.projectsService.findMany(query)
  }

  // 프로젝트 상세
  @Get(':slug')
  async getProject(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug)
  }

  // 프로젝트 생성
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createProject(@Body() dto: CreateProjectDto, @Req() req: any) {
    return this.projectsService.create(dto, req.user.id)
  }

  // 프로젝트 수정
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateProject(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Req() req: any,
  ) {
    return this.projectsService.update(id, dto, req.user.id)
  }

  // 프로젝트 삭제
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteProject(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.delete(id, req.user.id)
  }

  // 좋아요 토글
  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Param('id') id: string, @Req() req: any) {
    return this.projectsService.toggleLike(id, req.user.id)
  }
}
