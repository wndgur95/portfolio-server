import { Module } from '@nestjs/common';
import { UsersModule } from '@libs/dao/common/users/users.module';
import { TestTablesModule } from '@libs/dao/common/test-tables/test-tables.module';

@Module({
  imports: [UsersModule, TestTablesModule],
  exports: [UsersModule, TestTablesModule],
})
export class CommonModule {}
