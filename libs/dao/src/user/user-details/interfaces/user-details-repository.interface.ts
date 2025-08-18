import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { UserDetailEntity } from '@libs/dao/user/user-details/entities/user-detail.entity';

// export interface UserDetailsRepository extends AbstractRepositoryInterface<UserDetailEntity> {}
export type UserDetailsRepository =
  AbstractRepositoryInterface<UserDetailEntity>;

export const UserDetailsRepository = Symbol('UserDetailsRepository');
