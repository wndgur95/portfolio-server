import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { GroupMembersRepository } from '@libs/dao/common/group-members/interfaces/group-members-repository.interface';
import { GroupMembersDbRepository } from '@libs/dao/common/group-members/repositories/group-members-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [GroupMembersDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: GroupMembersRepository,
      inject: [GroupMembersDbRepository],
      useFactory: (repo: GroupMembersDbRepository): GroupMembersRepository => repo,
    },
  ],
  exports: [GroupMembersRepository],
})
export class GroupMembersModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}