import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { IdeasRepository } from '@libs/dao/common/ideas/interfaces/ideas-repository.interface';
import { IdeasDbRepository } from '@libs/dao/common/ideas/repositories/ideas-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [IdeasDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: IdeasRepository,
      inject: [IdeasDbRepository],
      useFactory: (repo: IdeasDbRepository): IdeasRepository => repo,
    },
  ],
  exports: [IdeasRepository],
})
export class IdeasModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}