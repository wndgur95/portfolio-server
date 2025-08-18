import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Group } from '@libs/dao/common/groups/interfaces/group.interface';

@Entity('group')
@BaseTimeEntity()
export class GroupEntity extends AbstractEntity implements Group {
  @Index()
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: false })
  memberCount: number;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  desc: string;

  @Column({ default: 0 })
  groupDbId: number;
}
