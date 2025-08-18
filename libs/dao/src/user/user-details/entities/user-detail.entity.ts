import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { UserDetail } from '@libs/dao/user/user-details/interfaces/user-detail.interface';

@Entity('user_detail')
@BaseTimeEntity()
export class UserDetailEntity extends AbstractEntity implements UserDetail {
  @Column({ comment: '유저 id', unsigned: true })
  userId: number;
}
