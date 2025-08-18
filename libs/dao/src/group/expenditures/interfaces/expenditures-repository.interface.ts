import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { ExpenditureEntity } from '@libs/dao/group/expenditures/entities/expenditure.entity';
import { Expenditure } from '@libs/dao/group/expenditures/interfaces/expenditure.interface';

export interface ExpendituresRepository
  extends AbstractRepositoryInterface<ExpenditureEntity> {
  findManyAndCountAndSumByGetExpenditure(
    groupId: number,
    groupMemberId: number,
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
    startAt: Date,
    endAt: Date,
  ): Promise<[Expenditure[], number, number]>;

  findManyAndSumByDate(
    groupId: number,
    groupMemberId: number,
    startAt: Date,
    endAt: Date,
  ): Promise<[ExpenditureEntity[], number]>;
}

export const ExpendituresRepository = Symbol('ExpendituresRepository');
