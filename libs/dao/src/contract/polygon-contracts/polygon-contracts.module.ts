import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { PolygonContractsRepository } from '@libs/dao/contract/polygon-contracts/interfaces/polygon-contracts-repository.interface';
import { PolygonContractsDbRepository } from '@libs/dao/contract/polygon-contracts/repositories/polygon-contracts-db.repository';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [PolygonContractsDbRepository],
      [ContractDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: PolygonContractsRepository,
      inject: [PolygonContractsDbRepository],
      useFactory: (repo: PolygonContractsDbRepository): PolygonContractsRepository => repo,
    },
  ],
  exports: [PolygonContractsRepository],
})
export class PolygonContractsModule {
  constructor(
    @InjectDataSource(ContractDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}