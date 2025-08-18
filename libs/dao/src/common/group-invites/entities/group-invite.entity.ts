import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { GroupInvite } from '@libs/dao/common/group-invites/interfaces/group-invite.interface';

@Entity('group_invite')
@BaseTimeEntity()
export class GroupInviteEntity extends AbstractEntity implements GroupInvite {
  @Column({ nullable: false })
  groupId: number;

  @Index()
  @Column({ nullable: false })
  userId: number;
}
