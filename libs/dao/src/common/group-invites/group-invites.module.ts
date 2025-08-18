import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { GroupInvitesRepository } from '@libs/dao/common/group-invites/interfaces/group-invites-repository.interface';
import { GroupInvitesDbRepository } from '@libs/dao/common/group-invites/repositories/group-invites-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [GroupInvitesDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: GroupInvitesRepository,
      inject: [GroupInvitesDbRepository],
      useFactory: (repo: GroupInvitesDbRepository): GroupInvitesRepository => repo,
    },
  ],
  exports: [GroupInvitesRepository],
})
export class GroupInvitesModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}