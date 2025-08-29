import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { TestTableEntity } from '@libs/dao/common/test-tables/entities/test-table.entity';
import { TestTable } from '@libs/dao/common/test-tables/interfaces/test-table.interface';

export interface TestTablesRepository
  extends AbstractRepositoryInterface<TestTableEntity> {
  findByContentsSafe(contents: string): Promise<TestTable>;
}

export const TestTablesRepository = Symbol('TestTablesRepository');
