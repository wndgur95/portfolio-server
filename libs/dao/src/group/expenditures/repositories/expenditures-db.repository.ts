import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { ExpenditureEntity } from '@libs/dao/group/expenditures/entities/expenditure.entity';
import { ExpendituresRepository } from '@libs/dao/group/expenditures/interfaces/expenditures-repository.interface';

export type ExpendituresDbRepositories = Record<string, ExpendituresRepository>;

@EntityRepository(ExpenditureEntity)
export class ExpendituresDbRepository
  extends AbstractRepository<ExpenditureEntity>
  implements ExpendituresRepository
{
  async findManyAndCountAndSumByGetExpenditure(
    groupId: number,
    groupMemberId: number,
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
    startAt: Date,
    endAt: Date,
  ): Promise<[ExpenditureEntity[], number, number]> {
    let query = this.queryBuilder
      .addSelect([
        `COUNT(*) OVER() AS totalCount`, // ✅ 전체 개수 가져오기
        `COALESCE(
        SUM(CASE 
          WHEN ${this.alias}.amountType = 1 THEN ${this.alias}.amount 
          WHEN ${this.alias}.amountType = 2 THEN -${this.alias}.amount 
          ELSE 0 
        END) OVER(), 
      0) AS totalAmount`, // ✅ 전체 금액 가져오기
      ])
      .where(`${this.alias}.groupId = :groupId`, { groupId });

    if (groupMemberId) {
      query = query.andWhere(`${this.alias}.groupMemberId = :groupMemberId`, {
        groupMemberId,
      });
    }

    const result = await query
      .andWhere(`${this.alias}.expenditureAt >= :startAt`, { startAt })
      .andWhere(`${this.alias}.expenditureAt < :endAt`, { endAt })
      .orderBy(`${this.alias}.expenditureAt`, orderBy)
      .take(take)
      .skip(skip)
      .getRawAndEntities();

    const totalCount =
      result.raw.length > 0 ? Number(result.raw[0].totalCount) : 0;
    const totalAmount =
      result.raw.length > 0 ? Number(result.raw[0].totalAmount) : 0;

    return [result.entities, totalCount, totalAmount];
  }

  async findManyAndSumByDate(
    groupId: number,
    groupMemberId: number,
    startAt: Date,
    endAt: Date,
  ): Promise<[ExpenditureEntity[], number]> {
    let query = this.queryBuilder
      .addSelect([
        `COALESCE(
        SUM(CASE 
          WHEN ${this.alias}.amountType = 1 THEN ${this.alias}.amount 
          WHEN ${this.alias}.amountType = 2 THEN -${this.alias}.amount 
          ELSE 0 
        END) OVER(), 
      0) AS totalAmount`, // ✅ 전체 금액 가져오기
      ])
      .where(`${this.alias}.groupId = :groupId`, { groupId });

    if (groupMemberId) {
      query = query.andWhere(`${this.alias}.groupMemberId = :groupMemberId`, {
        groupMemberId,
      });
    }

    const result = await query
      .andWhere(`${this.alias}.expenditureAt >= :startAt`, { startAt })
      .andWhere(`${this.alias}.expenditureAt < :endAt`, { endAt })
      .getRawAndEntities();

    const totalAmount =
      result.raw.length > 0 ? Number(result.raw[0].totalAmount) : 0;

    return [result.entities, totalAmount];
  }
}
