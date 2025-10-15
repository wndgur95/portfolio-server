import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { User } from '@libs/dao/common/users/interfaces/user.interface';

export interface UsersRepository
  extends AbstractRepositoryInterface<UserEntity> {
  findByEmail(email: string): Promise<User>;

  countByEmail(email: string): Promise<number>;

  existByEmail(email: string): Promise<boolean>;

  findAllAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
  ): Promise<[User[], number]>;

  findAllWithFilterAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
    filter?: any,
  ): Promise<[User[], number]>;

  findByAddress(address: string): Promise<User>;

  findByAddresses(addresses: string[]): Promise<User[]>;
}

export const UsersRepository = Symbol('UsersRepository');
