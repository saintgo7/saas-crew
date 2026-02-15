import {
  Controller,
  Get,
  Post,
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
import { CertificatesService } from './certificates.service'
import { IssueCertificateDto, VerifyCertificateDto } from './dto'

/**
 * Certificates Controller
 * Handles HTTP requests for certificate issuance and verification
 */
@ApiTags('Certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  /**
   * POST /api/certificates/issue
   * Issue a certificate for a completed course
   */
  @Post('issue')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Issue certificate',
    description: 'Issue a certificate for a completed course',
  })
  async issueCertificate(@Body() dto: IssueCertificateDto, @Req() req: any) {
    return this.certificatesService.issueCertificate(req.user.id, dto.courseId)
  }

  /**
   * GET /api/certificates/my
   * Get current user's certificates
   */
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get my certificates',
    description: "Get current user's certificates",
  })
  async getMyCertificates(@Req() req: any) {
    return this.certificatesService.getUserCertificates(req.user.id)
  }

  /**
   * POST /api/certificates/verify
   * Verify a certificate by number
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify certificate',
    description: 'Verify a certificate by its number (public endpoint)',
  })
  async verifyCertificate(@Body() dto: VerifyCertificateDto) {
    return this.certificatesService.verifyCertificate(dto.certificateNumber)
  }

  /**
   * GET /api/certificates/check/:courseId
   * Check if user can get certificate for a course
   */
  @Get('check/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Check course completion',
    description: 'Check if current user can get a certificate for a course',
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  async checkCompletion(@Param('courseId') courseId: string, @Req() req: any) {
    return this.certificatesService.checkCourseCompletion(req.user.id, courseId)
  }

  /**
   * GET /api/certificates/:id
   * Get certificate by ID
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get certificate',
    description: 'Get certificate details by ID',
  })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  async getCertificate(@Param('id') id: string, @Req() req: any) {
    return this.certificatesService.getCertificateById(id, req.user.id)
  }

  /**
   * GET /api/certificates/course/:courseId
   * Get all certificates for a course (admin)
   */
  @Get('course/:courseId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get course certificates',
    description: 'Get all certificates issued for a course (admin only)',
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  async getCourseCertificates(@Param('courseId') courseId: string) {
    return this.certificatesService.getCourseCertificates(courseId)
  }

  /**
   * GET /api/certificates/course/:courseId/stats
   * Get certificate statistics for a course
   */
  @Get('course/:courseId/stats')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get course certificate stats',
    description: 'Get certificate statistics for a course',
  })
  @ApiParam({ name: 'courseId', description: 'Course ID' })
  async getCourseStats(@Param('courseId') courseId: string) {
    return this.certificatesService.getCourseStats(courseId)
  }
}
