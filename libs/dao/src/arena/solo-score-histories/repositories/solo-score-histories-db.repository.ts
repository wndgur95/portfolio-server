import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { SoloScoreHistoryEntity } from '@libs/dao/arena/solo-score-histories/entities/solo-score-history.entity';
import { SoloScoreHistoriesRepository } from '@libs/dao/arena/solo-score-histories/interfaces/solo-score-histories-repository.interface';

@EntityRepository(SoloScoreHistoryEntity)
export class SoloScoreHistoriesDbRepository
  extends AbstractRepository<SoloScoreHistoryEntity>
  implements SoloScoreHistoriesRepository {}