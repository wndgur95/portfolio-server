import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { UserDetailEntity } from '@libs/dao/user/user-details/entities/user-detail.entity';
import { UserDetailsRepository } from '@libs/dao/user/user-details/interfaces/user-details-repository.interface';

export type UserDetailsDbRepositories = Record<string, UserDetailsRepository>;

@EntityRepository(UserDetailEntity)
export class UserDetailsDbRepository
  extends AbstractRepository<UserDetailEntity>
  implements UserDetailsRepository {}