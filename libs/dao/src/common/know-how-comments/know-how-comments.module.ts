import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { KnowHowCommentsRepository } from '@libs/dao/common/know-how-comments/interfaces/know-how-comments-repository.interface';
import { KnowHowCommentsDbRepository } from '@libs/dao/common/know-how-comments/repositories/know-how-comments-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [KnowHowCommentsDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: KnowHowCommentsRepository,
      inject: [KnowHowCommentsDbRepository],
      useFactory: (repo: KnowHowCommentsDbRepository): KnowHowCommentsRepository => repo,
    },
  ],
  exports: [KnowHowCommentsRepository],
})
export class KnowHowCommentsModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}