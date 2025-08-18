import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { IdeaCommentsRepository } from '@libs/dao/common/idea-comments/interfaces/idea-comments-repository.interface';
import { IdeaCommentsDbRepository } from '@libs/dao/common/idea-comments/repositories/idea-comments-db.repository';
import CommonDatabaseConfig from '@libs/dao/config/common/common-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [IdeaCommentsDbRepository],
      [CommonDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: IdeaCommentsRepository,
      inject: [IdeaCommentsDbRepository],
      useFactory: (repo: IdeaCommentsDbRepository): IdeaCommentsRepository => repo,
    },
  ],
  exports: [IdeaCommentsRepository],
})
export class IdeaCommentsModule {
  constructor(
    @InjectDataSource(CommonDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}