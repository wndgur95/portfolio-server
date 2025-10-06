import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { ImmutableContractsRepository } from '@libs/dao/contract/immutable-contracts/interfaces/immutable-contracts-repository.interface';
import { ImmutableContractsDbRepository } from '@libs/dao/contract/immutable-contracts/repositories/immutable-contracts-db.repository';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [ImmutableContractsDbRepository],
      [ContractDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: ImmutableContractsRepository,
      inject: [ImmutableContractsDbRepository],
      useFactory: (repo: ImmutableContractsDbRepository): ImmutableContractsRepository => repo,
    },
  ],
  exports: [ImmutableContractsRepository],
})
export class ImmutableContractsModule {
  constructor(
    @InjectDataSource(ContractDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}