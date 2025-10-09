import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import BatchDatabaseConfig from '@libs/dao/config/batch/batch-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PortfolioCoinAirdropQueuesDbRepository } from '@libs/dao/batch/portfolio/coin-airdrop-queues/repositories/portfolio-coin-airdrop-queues-db.repository';
import { PortfolioCoinAirdropQueuesRepository } from '@libs/dao/batch/portfolio/coin-airdrop-queues/interfaces/portfolio-coin-airdrop-queues-repository.interface';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PortfolioCoinAirdropQueuesDbRepository],
      [BatchDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PortfolioCoinAirdropQueuesRepository,
      inject: [PortfolioCoinAirdropQueuesDbRepository],
      useFactory: (
        repo: PortfolioCoinAirdropQueuesDbRepository,
      ): PortfolioCoinAirdropQueuesRepository => repo,
    },
  ],
  exports: [PortfolioCoinAirdropQueuesRepository],
})
export class PortfolioCoinAirdropQueuesModule {
  constructor(
    @InjectDataSource(BatchDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
