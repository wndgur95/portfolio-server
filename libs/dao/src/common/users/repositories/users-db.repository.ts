import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { getDatabaseByUserDbId } from '@libs/dao/config/user/user-database-config.util';
import { ContextProvider } from '@libs/common/provider/context.provider';

@EntityRepository(UserEntity)
export class UsersDbRepository
  extends AbstractRepository<UserEntity>
  implements UsersRepository
{
  async findAndSetOtherUserDatabaseByRecommendCode(
    recommendCode: string,
  ): Promise<User> {
    const user = await this.queryBuilder
      .where(`${this.alias}.recommendCode = :recommendCode`, { recommendCode })
      .getOne();

    if (user.userDbId) {
      const database = getDatabaseByUserDbId(user.userDbId);
      ContextProvider.setOtherUserDatabase(database);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.queryBuilder
      .where(`${this.alias}.email = :email`, { email })
      .getOne();
  }

  async countByEmail(email: string): Promise<number> {
    return await this.queryBuilder
      .where(`${this.alias}.email=:email`, { email })
      .getCount();
  }

  async findAllAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
  ): Promise<[UserEntity[], number]> {
    return await this.queryBuilder
      .take(take)
      .skip(skip)
      .orderBy(`${this.alias}.id`, orderBy)
      .getManyAndCount();
  }
}
