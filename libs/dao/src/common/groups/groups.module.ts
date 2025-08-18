import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { GroupsRepository } from '@libs/dao/common/groups/interfaces/groups-repository.interface';
import { GroupsDbRepository } from '@libs/dao/common/groups/repositories/groups-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [GroupsDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: GroupsRepository,
      inject: [GroupsDbRepository],
      useFactory: (repo: GroupsDbRepository): GroupsRepository => repo,
    },
  ],
  exports: [GroupsRepository],
})
export class GroupsModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}