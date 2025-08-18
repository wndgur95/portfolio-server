import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { KnowHow } from '@libs/dao/common/know-hows/interfaces/know-how.interface';

@Entity('know_how')
@BaseTimeEntity()
export class KnowHowEntity extends AbstractEntity implements KnowHow {
  @Column()
  userId: number;

  @Column({ length: 30 })
  nickname: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  contexts: string;
}
