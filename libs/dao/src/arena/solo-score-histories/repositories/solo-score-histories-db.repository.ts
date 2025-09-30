import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { SoloScoreHistoryEntity } from '@libs/dao/arena/solo-score-histories/entities/solo-score-history.entity';
import { SoloScoreHistoriesRepository } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-histories-repository.interface';
import { FilterValue } from '@libs/common/dto/pagination-in.dto';
import { SoloScoreHistory } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-history.interface';

@EntityRepository(SoloScoreHistoryEntity)
export class SoloScoreHistoriesDbRepository
  extends AbstractRepository<SoloScoreHistoryEntity>
  implements SoloScoreHistoriesRepository
{
  async findAllWithFilterAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
    filter?: Record<string, FilterValue>,
  ): Promise<[SoloScoreHistory[], number]> {
    const qb = this.queryBuilder;

    return await this.applyDynamicFilters(qb, filter)
      .take(take)
      .skip(skip)
      .orderBy(`${qb.alias}.id`, orderBy)
      .getManyAndCount();
  }
}
