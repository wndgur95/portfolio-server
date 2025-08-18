import { Module } from '@nestjs/common';
import { ExpendituresModule } from '@libs/dao/group/expenditures/expenditures.module';

@Module({
  exports: [ExpendituresModule],
  imports: [ExpendituresModule],
})
export class GroupModule {}
