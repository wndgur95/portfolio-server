import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { SoloScoresRepository } from '@libs/dao/arena/solo-scores/interfaces/solo-scores-repository.interface';
import { SoloScoresDbRepository } from '@libs/dao/arena/solo-scores/repositories/solo-scores-db.repository';
import ArenaDatabaseConfig from '@libs/dao/config/arena/arena-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [SoloScoresDbRepository],
      [ArenaDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: SoloScoresRepository,
      inject: [SoloScoresDbRepository],
      useFactory: (repo: SoloScoresDbRepository): SoloScoresRepository => repo,
    },
  ],
  exports: [SoloScoresRepository],
})
export class SoloScoresModule {
  constructor(
    @InjectDataSource(ArenaDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}