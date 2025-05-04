import { Module } from '@nestjs/common'
import { BackupService } from './backup.service'
import { BackupController } from './backup.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [BackupService],
  controllers: [BackupController],
})
export class BackupModule {}
