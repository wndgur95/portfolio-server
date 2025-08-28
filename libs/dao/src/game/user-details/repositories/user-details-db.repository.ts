import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { UserDetailEntity } from '@libs/dao/game/user-details/entities/user-detail.entity';
import { UserDetailsRepository } from '@libs/dao/game/user-details/interfaces/user-details-repository.interface';
import { UserDetail } from '@libs/dao/game/user-details/interfaces/user-detail.interface';

export type UserDetailsDbRepositories = Record<string, UserDetailsRepository>;

@EntityRepository(UserDetailEntity)
export class UserDetailsDbRepository
  extends AbstractRepository<UserDetailEntity>
  implements UserDetailsRepository
{
  async findByUserId(userId: number): Promise<UserDetail> {
    return await this.queryBuilder
      .where(`${this.alias}.userId = :userId`, { userId })
      .getOne();
  }

  async updateGold(userId: number, gold: number): Promise<void> {
    await this.queryBuilder
      .update(this.alias)
      .set({ gold })
      .where(`${this.alias}.user_id = :userId`, { userId })
      .execute();
  }
}
