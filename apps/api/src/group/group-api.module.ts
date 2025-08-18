import { Module } from '@nestjs/common';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { CommonModule } from '@libs/dao/common/common.module';
import { ExpenditureController } from './expenditure/expenditure.controller';
import { ExpenditureService } from './expenditure/expenditure.service';
import { GroupModule } from '@libs/dao/group/group.module';
import { FriendsModule } from '@libs/dao/user/friends/friends.module';

@Module({
  imports: [CommonModule, GroupModule, FriendsModule],
  controllers: [GroupController, ExpenditureController],
  providers: [GroupService, ExpenditureService],
})
export class GroupApiModule {}
