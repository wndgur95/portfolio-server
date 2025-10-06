import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { MetadataFormsRepository } from '@libs/dao/contract/metadata-forms/interfaces/metadata-forms-repository.interface';
import { MetadataFormsDbRepository } from '@libs/dao/contract/metadata-forms/repositories/metadata-forms-db.repository';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [MetadataFormsDbRepository],
      [ContractDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: MetadataFormsRepository,
      inject: [MetadataFormsDbRepository],
      useFactory: (repo: MetadataFormsDbRepository): MetadataFormsRepository => repo,
    },
  ],
  exports: [MetadataFormsRepository],
})
export class MetadataFormsModule {
  constructor(
    @InjectDataSource(ContractDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}