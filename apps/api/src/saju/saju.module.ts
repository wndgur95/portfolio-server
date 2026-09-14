import { Module } from '@nestjs/common';
import { SajuDaoModule } from '@libs/dao/saju/saju-dao.module';
import { SajuController } from './saju.controller';
import { SajuService } from './saju.service';

@Module({
  imports: [SajuDaoModule],
  controllers: [SajuController],
  providers: [SajuService],
  exports: [SajuService],
})
export class SajuModule {}
