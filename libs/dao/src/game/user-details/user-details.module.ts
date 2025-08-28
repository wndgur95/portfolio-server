import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { UserDetailsRepository } from '@libs/dao/game/user-details/interfaces/user-details-repository.interface';
import { UserDetailsDbRepository } from '@libs/dao/game/user-details/repositories/user-details-db.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { getGameShardDatabases } from '@libs/dao/config/game/game-database-config.util';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [UserDetailsDbRepository],
      getGameShardDatabases,
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
    @InjectDataSource(...getGameShardDatabases)
    private readonly dataSources: DataSource[],
  ) {}

  async onModuleDestroy(): Promise<void> {
    for (const dataSource of this.dataSources) {
      await dataSource.destroy();
    }
  }
}