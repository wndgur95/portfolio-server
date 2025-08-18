import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { RoulettesRepository } from '@libs/dao/wedding/roulettes/interfaces/roulettes-repository.interface';
import { RoulettesDbRepository } from '@libs/dao/wedding/roulettes/repositories/roulettes-db.repository';
import WeddingDatabaseConfig from '@libs/dao/config/wedding/wedding-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [RoulettesDbRepository],
      [WeddingDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: RoulettesRepository,
      inject: [RoulettesDbRepository],
      useFactory: (repo: RoulettesDbRepository): RoulettesRepository => repo,
    },
  ],
  exports: [RoulettesRepository],
})
export class RoulettesModule {
  constructor(
    @InjectDataSource(WeddingDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
