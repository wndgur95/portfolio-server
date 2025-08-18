import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { UserDetailsRepository } from '@libs/dao/user/user-details/interfaces/user-details-repository.interface';
import { UserDetailsDbRepository } from '@libs/dao/user/user-details/repositories/user-details-db.repository';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [UserDetailsDbRepository],
      getUserShardDatabases,
    ),
  ],
  providers: [
    {
      provide: UserDetailsRepository,
      inject: [UserDetailsDbRepository],
      useFactory: (repo: UserDetailsDbRepository): UserDetailsRepository => repo,
    },
  ],
  exports: [UserDetailsRepository],
})
export class UserDetailsModule {
  constructor(
    @InjectDataSource(...getUserShardDatabases)
    private readonly dataSources: DataSource[],
  ) {}

  async onModuleDestroy(): Promise<void> {
    for (const dataSource of this.dataSources) {
      await dataSource.destroy();
    }
  }
}