import { EntityManager, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { FilterValue } from '@libs/common/dto/pagination-in.dto';
import { ClassConstructor } from 'class-transformer';
import { getCustomRepository } from '@libs/common/databases/typeorm/typeorm-ex.module';

export abstract class AbstractRepository<Entity>
  extends Repository<Entity>
  implements AbstractRepositoryInterface<Entity>
{
  protected readonly alias: string = super.metadata.tableName;

  private get entityManager(): EntityManager {
    const queryRunner = TypeOrmHelper.getQueryRunner(
      this.metadata.connection.name,
    );

    return queryRunner ? queryRunner.manager : this.manager;
  }

  get queryBuilder(): SelectQueryBuilder<Entity> {
    return this.entityManager.createQueryBuilder(this.target, this.alias);
  }

  async findById(id: number): Promise<Entity> {
    return await this.queryBuilder
      .where(`${this.alias}.id=:id`, { id: id })
      .getOne();
  }

  async findByIdIn(ids: number[]): Promise<Entity[]> {
    return await this.queryBuilder.whereInIds(ids).getMany();
  }

  async insert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    return await this.queryBuilder.insert().values(entityOrEntities).execute();
  }

  async upsert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | QueryDeepPartialEntity<Entity>[],
    conflictPathsOrOptions: string[] | UpsertOptions<Entity>,
  ): Promise<InsertResult> {
    return await this.entityManager.upsert(
      this.target,
      entityOrEntities,
      conflictPathsOrOptions,
    );
  }

  async save<T>(entity: T, options?: SaveOptions): Promise<T>;
  async save<T>(entities: T[], options?: SaveOptions): Promise<T[]>;
  async save<T>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    return await this.entityManager.save(entityOrEntities, options);
  }

  async updateById<Entity>(
    id: number,
    values: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    const result = await this.queryBuilder
      .update(this.alias)
      .set(values)
      .where(`${this.alias}.id = :id`, { id: id })
      .execute();

    if (!result.affected) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DB_UPDATE_FAILED);
    }

    return result;
  }

  async updateByIdIn<Entity>(
    ids: number[],
    values: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    const result = await this.queryBuilder
      .update(this.alias)
      .set(values)
      .whereInIds(ids)
      .execute();

    if (!result.affected) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DB_UPDATE_FAILED);
    }

    return result;
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.queryBuilder
      .delete()
      .from(this.alias)
      .where(`${this.alias}.id = :id`, { id: id })
      .execute();
  }

  async deleteByIdIn(ids: number[]): Promise<DeleteResult> {
    return await this.queryBuilder
      .delete()
      .from(this.alias)
      .whereInIds(ids)
      .execute();
  }

  /**
   * 동적 필터를 쿼리빌더에 적용
   */
  protected applyDynamicFilters(
    qb: SelectQueryBuilder<Entity>,
    filter?: Record<string, FilterValue>,
  ): SelectQueryBuilder<Entity> {
    if (filter) {
      Object.entries(filter).forEach(([field, filter]) => {
        if (!filter || !filter.type) return;
        if (['eq', 'gte', 'lte'].includes(filter.type)) {
          if (filter.type === 'eq')
            qb.andWhere(`${qb.alias}.${field} = :${field}`, {
              [field]: filter.value,
            });
          if (filter.type === 'gte')
            qb.andWhere(`${qb.alias}.${field} >= :${field}_gte`, {
              [`${field}_gte`]: filter.value,
            });
          if (filter.type === 'lte')
            qb.andWhere(`${qb.alias}.${field} <= :${field}_lte`, {
              [`${field}_lte`]: filter.value,
            });
        }
        if (filter.type === 'like') {
          qb.andWhere(`${qb.alias}.${field} LIKE :${field}_like`, {
            [`${field}_like`]: `%${filter.value}%`,
          });
        }
        if (filter.type === 'eq' && typeof filter.value === 'string') {
          qb.andWhere(`${qb.alias}.${field} = :${field}_str`, {
            [`${field}_str`]: filter.value,
          });
        }
        if (
          filter.type === 'between' &&
          Array.isArray(filter.value) &&
          filter.value.length === 2
        ) {
          qb.andWhere(
            `${qb.alias}.${field} BETWEEN :${field}_from AND :${field}_to`,
            {
              [`${field}_from`]: filter.value[0],
              [`${field}_to`]: filter.value[1],
            },
          );
        }
        if (
          filter.type === 'in' &&
          Array.isArray(filter.value) &&
          filter.value.length > 0
        ) {
          qb.andWhere(`${qb.alias}.${field} IN (:...${field}_in)`, {
            [`${field}_in`]: filter.value,
          });
        }
      });
    }
    return qb;
  }

  static instance<T>(this: ClassConstructor<T>, database: string): T {
    return getCustomRepository(this, database);
  }
}
