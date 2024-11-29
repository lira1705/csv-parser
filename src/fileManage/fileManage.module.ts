import { Module } from '@nestjs/common';
import { FileManageService } from './fileManage.service';

@Module({
  providers: [FileManageService],
  exports: [FileManageService],
})
export class FileManageModule {}
