import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { SqlInjection } from '@libs/dao/common/sql-injections/interfaces/sql-injection.interface';

@Entity('sql_injection')
@BaseTimeEntity()
export class SqlInjectionEntity extends AbstractEntity implements SqlInjection {
  @Column({ nullable: true })
  contents?: string;
}
