import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { FindOptionsWhere, ObjectId } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { UserEntity } from '@libs/dao/common/users/entities/user.entity';
import { User } from '@libs/dao/common/users/interfaces/user.interface';

export interface UsersRepository
  extends AbstractRepositoryInterface<UserEntity> {
  findAndSetOtherUserDatabaseByRecommendCode(
    recommendCode: string,
  ): Promise<User>;

  findByEmail(email: string): Promise<User>;

  countByEmail(email: string): Promise<number>;

  findAllAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
  ): Promise<[User[], number]>;

  save<User>(entity: User, options?: SaveOptions): Promise<User>;
  save<User>(entities: User[], options?: SaveOptions): Promise<User[]>;

  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<User>,
    partialEntity: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult>;

  softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<User>,
  ): Promise<UpdateResult>;
}

export const UsersRepository = Symbol('UsersRepository');
