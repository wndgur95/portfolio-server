import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@libs/common/databases/typeorm/typeorm-ex.module';
import { ShapesRepository } from '@libs/dao/contract/shapes/interfaces/shapes-repository.interface';
import { ShapesDbRepository } from '@libs/dao/contract/shapes/repositories/shapes-db.repository';
import ContractDatabaseConfig from '@libs/dao/config/contract/contract-database.config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmExModule.forFeatures(
      [ShapesDbRepository],
      [ContractDatabaseConfig().name],
    ),
  ],
  providers: [
    {
      provide: ShapesRepository,
      inject: [ShapesDbRepository],
      useFactory: (repo: ShapesDbRepository): ShapesRepository => repo,
    },
  ],
  exports: [ShapesRepository],
})
export class ShapesModule {
  constructor(
    @InjectDataSource(ContractDatabaseConfig().name)
    private readonly dataSource: DataSource,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}