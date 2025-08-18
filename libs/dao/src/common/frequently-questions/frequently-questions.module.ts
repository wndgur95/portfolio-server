import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { FrequentlyQuestionsRepository } from '@libs/dao/common/frequently-questions/interfaces/frequently-questions-repository.interface';
import { FrequentlyQuestionsDbRepository } from '@libs/dao/common/frequently-questions/repositories/frequently-questions-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [FrequentlyQuestionsDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: FrequentlyQuestionsRepository,
      inject: [FrequentlyQuestionsDbRepository],
      useFactory: (repo: FrequentlyQuestionsDbRepository): FrequentlyQuestionsRepository => repo,
    },
  ],
  exports: [FrequentlyQuestionsRepository],
})
export class FrequentlyQuestionsModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}