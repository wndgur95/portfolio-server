import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { DeveloperNotesRepository } from '@libs/dao/common/developer-notes/interfaces/developer-notes-repository.interface';
import { DeveloperNotesDbRepository } from '@libs/dao/common/developer-notes/repositories/developer-notes-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [DeveloperNotesDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: DeveloperNotesRepository,
      inject: [DeveloperNotesDbRepository],
      useFactory: (repo: DeveloperNotesDbRepository): DeveloperNotesRepository => repo,
    },
  ],
  exports: [DeveloperNotesRepository],
})
export class DeveloperNotesModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}