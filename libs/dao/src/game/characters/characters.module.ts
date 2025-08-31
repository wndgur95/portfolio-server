import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { CharactersDbRepository } from '@libs/dao/game/characters/repositories/characters-db.repository';
import { getGameShardDatabases } from '@libs/dao/config/game/game-database-config.util';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [CharactersDbRepository],
      getGameShardDatabases,
    ),
  ],
  providers: [
    {
      provide: CharactersRepository,
      inject: [CharactersDbRepository],
      useFactory: (repo: CharactersDbRepository): CharactersRepository => repo,
    },
  ],
  exports: [CharactersRepository],
})
export class CharactersModule {
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