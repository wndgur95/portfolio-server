import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { TestTableEntity } from '@libs/dao/common/test-tables/entities/test-table.entity';
import { TestTablesRepository } from '@libs/dao/common/test-tables/interfaces/test-tables-repository.interface';
import { TestTable } from '@libs/dao/common/test-tables/interfaces/test-table.interface';

@EntityRepository(TestTableEntity)
export class TestTablesDbRepository
  extends AbstractRepository<TestTableEntity>
  implements TestTablesRepository {

  async findByContentsSafe(contents: string): Promise<TestTable> {
    return await this.queryBuilder
      .where(`${this.alias}.contents = :contents`, { contents })
      .getOne();
  }

  async findByIdRowLevelLock(id: number): Promise<TestTable> {
    return await this.queryBuilder
      .where(`${this.alias}.id = :id`, { id })
      .setLock('pessimistic_write')
      .getOne();
  }
}