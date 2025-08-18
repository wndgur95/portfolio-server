import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { GroupMemberEntity } from '@libs/dao/common/group-members/entities/group-member.entity';
import { GroupMember } from '@libs/dao/common/group-members/interfaces/group-member.interface';

export interface GroupMembersRepository
  extends AbstractRepositoryInterface<GroupMemberEntity> {
  findManyAndCountByUserId(
    userId: number,
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
  ): Promise<[GroupMember[], number]>;
}

export const GroupMembersRepository = Symbol('GroupMembersRepository');
