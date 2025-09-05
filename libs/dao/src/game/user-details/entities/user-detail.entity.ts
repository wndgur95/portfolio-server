import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';
import { Currency } from '@libs/dao/game/user-details/type/currency';

@Entity('user_detail')
@BaseTimeEntity()
export class UserDetailEntity extends AbstractEntity implements UserDetail {
  @Index({ unique: true })
  @Column({ comment: '유저 id', unsigned: true })
  userId: number;

  @Column(() => Currency)
  currency: Currency;
}
