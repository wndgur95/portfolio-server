import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { PatchNotesRepository } from '@libs/dao/common/patch-notes/interfaces/patch-notes-repository.interface';
import { PatchNotesDbRepository } from '@libs/dao/common/patch-notes/repositories/patch-notes-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PatchNotesDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PatchNotesRepository,
      inject: [PatchNotesDbRepository],
      useFactory: (repo: PatchNotesDbRepository): PatchNotesRepository => repo,
    },
  ],
  exports: [PatchNotesRepository],
})
export class PatchNotesModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}