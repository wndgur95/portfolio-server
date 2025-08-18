import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { WeddingMessagesRepository } from '@libs/dao/wedding/wedding-messages/interfaces/wedding-messages-repository.interface';
import { WeddingMessagesDbRepository } from '@libs/dao/wedding/wedding-messages/repositories/wedding-messages-db.repository';
import WeddingDatabaseConfig from '@libs/dao/config/wedding/wedding-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [WeddingMessagesDbRepository],
      [WeddingDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: WeddingMessagesRepository,
      inject: [WeddingMessagesDbRepository],
      useFactory: (
        repo: WeddingMessagesDbRepository,
      ): WeddingMessagesRepository => repo,
    },
  ],
  exports: [WeddingMessagesRepository],
})
export class WeddingMessagesModule {
  constructor(
    @InjectDataSource(WeddingDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
