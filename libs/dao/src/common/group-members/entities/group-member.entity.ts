import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { GroupMember } from '@libs/dao/common/group-members/interfaces/group-member.interface';
import { GroupMemberRoles } from '@libs/common/constants/role.constants';

@Entity('group_member')
@BaseTimeEntity()
@Index(['groupId', 'userId'], { unique: true })
export class GroupMemberEntity extends AbstractEntity implements GroupMember {
  @Column({ nullable: false })
  groupId: number;

  @Index()
  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  role: GroupMemberRoles;

  @Column({ nullable: true })
  signUpAt: Date;
}
