import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { SoloScoreHistoriesRepository } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-histories-repository.interface';
import { SoloScoreHistoriesDbRepository } from '@libs/dao/arena/solo-score-histories/repositories/solo-score-histories-db.repository';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [SoloScoreHistoriesDbRepository],
      [ArenaDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: SoloScoreHistoriesRepository,
      inject: [SoloScoreHistoriesDbRepository],
      useFactory: (repo: SoloScoreHistoriesDbRepository): SoloScoreHistoriesRepository => repo,
    },
  ],
  exports: [SoloScoreHistoriesRepository],
})
export class SoloScoreHistoriesModule {
  constructor(
    @InjectDataSource(ArenaDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}