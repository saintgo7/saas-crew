import { Module } from '@nestjs/common'
import { CertificatesController } from './certificates.controller'
import { CertificatesService } from './certificates.service'
import { XpModule } from '../xp/xp.module'

/**
 * Certificates Module
 * Provides certificate issuance and verification functionality
 */
@Module({
  imports: [XpModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
