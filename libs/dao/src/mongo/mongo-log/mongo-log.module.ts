import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { SurviveMongoLogDocumentRepository } from '@libs/dao/mongo/mongo-log/repositories/survive-mongo-log-document.repository';
import {
  MongoLogRepositories,
  MongoLogRepository,
} from '@libs/common/databases/mongo/mongo-log-repository.interface';

@Module({
  providers: [
    SurviveMongoLogDocumentRepository,
    {
      provide: MongoLogRepositories,
      inject: [SurviveMongoLogDocumentRepository],
      useFactory: (
        ...repositories: MongoLogRepository[]
      ): Record<string, MongoLogRepository> =>
        Object.fromEntries(
          repositories.map((it) => [it.connectionName.toUpperCase(), it]),
        ),
    },
  ],
  exports: [MongoLogRepositories],
})
export class MongoLogDocumentModule implements OnModuleDestroy {
  constructor(
    @Inject(MongoLogRepositories)
    private readonly mongoLogRepositories: Record<string, MongoLogRepository>,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await Promise.all(
      Object.values(this.mongoLogRepositories).map((it) => it.close()),
    );
  }
}
