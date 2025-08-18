import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { FriendEntity } from '@libs/dao/user/friends/entities/friend.entity';
import { FriendsRepository } from '@libs/dao/user/friends/interfaces/friends-repository.interface';

export type FriendsDbRepositories = Record<string, FriendsRepository>;

@EntityRepository(FriendEntity)
export class FriendsDbRepository
  extends AbstractRepository<FriendEntity>
  implements FriendsRepository
{
  async findManyAndCountByUserId(
    userId: number,
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
  ): Promise<[FriendEntity[], number]> {
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
