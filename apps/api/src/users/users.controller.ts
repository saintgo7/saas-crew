import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // 사용자 프로필 조회
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  // 프로필 수정 (본인만)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    // 본인 확인
    if (req.user.id !== id) {
      throw new Error('권한이 없습니다.')
    }

    return this.usersService.update(id, dto)
  }

  // 사용자의 프로젝트 목록
  @Get(':id/projects')
  async getUserProjects(@Param('id') id: string) {
    return this.usersService.findUserProjects(id)
  }
}
