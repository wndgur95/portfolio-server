import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { FriendsRepository } from '@libs/dao/user/friends/interfaces/friends-repository.interface';
import { FriendsDbRepository } from '@libs/dao/user/friends/repositories/friends-db.repository';
import { getUserShardDatabases } from '@libs/dao/config/user/user-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [FriendsDbRepository],
      getUserShardDatabases,
    ),
  ],
  providers: [
    {
      provide: FriendsRepository,
      inject: [FriendsDbRepository],
      useFactory: (repo: FriendsDbRepository): FriendsRepository => repo,
    },
  ],
  exports: [FriendsRepository],
})
export class FriendsModule {
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