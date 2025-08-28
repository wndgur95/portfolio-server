import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { UserDetailEntity } from '@libs/dao/game/user-details/entities/user-detail.entity';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';

export interface UserDetailsRepository
  extends AbstractRepositoryInterface<UserDetailEntity> {
  findByUserId(userId: number): Promise<UserDetail>;

  updateGold(userId: number, gold: number): Promise<void>;
}

export const UserDetailsRepository = Symbol('UserDetailsRepository');
