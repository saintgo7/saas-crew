import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
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
import { CanvasService } from './canvas.service'
import { CreateCanvasDto, UpdateCanvasDto, SaveCanvasDto } from './dto'

@ApiTags('Canvas')
@Controller('canvas')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new canvas' })
  @ApiResponse({ status: 201, description: 'Canvas created' })
  async create(@Req() req: any, @Body() dto: CreateCanvasDto) {
    return this.canvasService.create(req.user.id, dto)
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all canvases for current user' })
  @ApiResponse({ status: 200, description: 'Canvases retrieved' })
  async findAll(@Req() req: any) {
    return this.canvasService.findAllByUser(req.user.id)
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Canvas ID' })
  @ApiOperation({ summary: 'Get canvas by ID' })
  @ApiResponse({ status: 200, description: 'Canvas retrieved' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.canvasService.findOne(id, req.user.id)
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Canvas ID' })
  @ApiOperation({ summary: 'Update canvas metadata' })
  @ApiResponse({ status: 200, description: 'Canvas updated' })
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateCanvasDto,
  ) {
    return this.canvasService.update(id, req.user.id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Canvas ID' })
  @ApiOperation({ summary: 'Delete a canvas' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Canvas deleted' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.canvasService.remove(id, req.user.id)
  }

  @Post(':id/save')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Canvas ID' })
  @ApiOperation({ summary: 'Save canvas data (Excalidraw JSON)' })
  @ApiResponse({ status: 200, description: 'Canvas data saved' })
  async saveData(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: SaveCanvasDto,
  ) {
    return this.canvasService.saveData(id, req.user.id, dto)
  }

  @Get('project/:projectId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiOperation({ summary: 'Get canvases by project' })
  @ApiResponse({ status: 200, description: 'Project canvases retrieved' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.canvasService.findByProject(projectId)
  }
}
