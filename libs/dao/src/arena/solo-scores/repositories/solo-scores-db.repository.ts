import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { SoloScoreEntity } from '@libs/dao/arena/solo-scores/entities/solo-score.entity';
import { SoloScoresRepository } from '@libs/dao/arena/solo-scores/interfaces/solo-scores-repository.interface';
import { SoloScore } from '@libs/dao/arena/solo-scores/interfaces/solo-score.interface';

@EntityRepository(SoloScoreEntity)
export class SoloScoresDbRepository
  extends AbstractRepository<SoloScoreEntity>
  implements SoloScoresRepository {

  async findByUserId(userId: number): Promise<SoloScore> {
    return await this.queryBuilder
      .where(`${this.alias}.userId = :userId`, { userId: userId })
      .getOne();
  }
}