import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';

@EntityRepository(UserEntity)
export class UsersDbRepository
  extends AbstractRepository<UserEntity>
  implements UsersRepository
{
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

  async existByEmail(email: string): Promise<boolean> {
    return await this.queryBuilder
      .where(`${this.alias}.email=:email`, { email })
      .getExists(); // 첫 번째 레코드만 찾으면 즉시 중단
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
