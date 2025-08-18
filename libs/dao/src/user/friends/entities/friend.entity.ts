import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Friend } from '@libs/dao/user/friends/interfaces/friend.interface';
import { FriendRequestType } from '@libs/common/constants/friend.constants';

@Entity('friend')
@Index(['userId', 'friendUserId'], { unique: true })
@BaseTimeEntity()
export class FriendEntity extends AbstractEntity implements Friend {
  @Column()
  userId: number;

  @Column()
  friendUserId: number;

  @Column({ type: 'tinyint' })
  status: FriendRequestType;
}
