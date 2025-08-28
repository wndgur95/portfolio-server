import { Module } from '@nestjs/common';
import { UserDetailsModule } from '@libs/dao/game/user-details/user-details.module';

@Module({
  exports: [UserDetailsModule],
  imports: [UserDetailsModule],
})
export class UserModule {}
