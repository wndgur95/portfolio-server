import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { KnowHowsRepository } from '@libs/dao/common/know-hows/interfaces/know-hows-repository.interface';
import { KnowHowsDbRepository } from '@libs/dao/common/know-hows/repositories/know-hows-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [KnowHowsDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: KnowHowsRepository,
      inject: [KnowHowsDbRepository],
      useFactory: (repo: KnowHowsDbRepository): KnowHowsRepository => repo,
    },
  ],
  exports: [KnowHowsRepository],
})
export class KnowHowsModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}