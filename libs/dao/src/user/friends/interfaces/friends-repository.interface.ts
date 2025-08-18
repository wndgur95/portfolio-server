import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { FriendEntity } from '@libs/dao/user/friends/entities/friend.entity';
import { Friend } from '@libs/dao/user/friends/interfaces/friend.interface';

export interface FriendsRepository
  extends AbstractRepositoryInterface<FriendEntity> {
  findManyAndCountByUserId(
    userId: number,
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
  ): Promise<[Friend[], number]>;
}

export const FriendsRepository = Symbol('FriendsRepository');
