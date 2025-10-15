import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { FilterValue } from '@libs/common/dto/pagination-in.dto';
import { User } from '@libs/dao/common/users/interfaces/user.interface';

@EntityRepository(UserEntity)
export class UsersDbRepository
  extends AbstractRepository<UserEntity>
  implements UsersRepository
{
  async findByEmail(email: string): Promise<User> {
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
  ): Promise<[User[], number]> {
    return await this.queryBuilder
      .take(take)
      .skip(skip)
      .orderBy(`${this.alias}.id`, orderBy)
      .getManyAndCount();
  }

  async findAllWithFilterAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
    filter?: Record<string, FilterValue>,
  ): Promise<[User[], number]> {
    const qb = this.queryBuilder;

    return await this.applyDynamicFilters(qb, filter)
      .take(take)
      .skip(skip)
      .orderBy(`${qb.alias}.id`, orderBy)
      .getManyAndCount();
  }

  async findByAddress(address: string): Promise<User> {
    return await this.queryBuilder
      .where(`${this.alias}.address = :address`, { address })
      .getOne();
  }

  async findByAddresses(addresses: string[]): Promise<User[]> {
    return await this.queryBuilder
      .where(`${this.alias}.address IN (:...addresses)`, { addresses })
      .getMany();
  }
}
