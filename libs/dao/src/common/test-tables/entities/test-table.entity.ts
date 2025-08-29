import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { TestTable } from '@libs/dao/common/test-tables/interfaces/test-table.interface';

@Entity('test_table')
@BaseTimeEntity()
export class TestTableEntity extends AbstractEntity implements TestTable {
  @Index()
  @Column({ nullable: true })
  contents?: string;

  @Column({ default: 0 })
  count: number;
}
