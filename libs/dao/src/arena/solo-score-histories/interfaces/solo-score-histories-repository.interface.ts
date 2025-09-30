import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { SoloScoreHistoryEntity } from '@libs/dao/arena/solo-score-histories/entities/solo-score-history.entity';
import { SoloScoreHistory } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-history.interface';

export interface SoloScoreHistoriesRepository
  extends AbstractRepositoryInterface<SoloScoreHistoryEntity> {
  findAllWithFilterAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
    filter?: any,
  ): Promise<[SoloScoreHistory[], number]>;
}

export const SoloScoreHistoriesRepository = Symbol(
  'SoloScoreHistoriesRepository',
);
