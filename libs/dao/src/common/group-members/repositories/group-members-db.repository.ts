import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { GroupMemberEntity } from '@libs/dao/common/group-members/entities/group-member.entity';
import { GroupMembersRepository } from '@libs/dao/common/group-members/interfaces/group-members-repository.interface';

@EntityRepository(GroupMemberEntity)
export class GroupMembersDbRepository
  extends AbstractRepository<GroupMemberEntity>
  implements GroupMembersRepository
{
  async findManyAndCountByUserId(
    userId: number,
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
  ): Promise<[GroupMemberEntity[], number]> {
    return await this.queryBuilder
      .where(`${this.alias}.userId = :userId`, {
        userId,
      })
      .take(take)
      .skip(skip)
      .orderBy('id', orderBy)
      .getManyAndCount();
  }
}
