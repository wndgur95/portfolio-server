import { Module } from '@nestjs/common';
import { UsersModule } from '@libs/dao/common/users/users.module';
import { SqlInjectionsModule } from '@libs/dao/common/sql-injections/sql-injections.module';

@Module({
  imports: [UsersModule, SqlInjectionsModule],
  exports: [UsersModule, SqlInjectionsModule],
})
export class CommonModule {}
