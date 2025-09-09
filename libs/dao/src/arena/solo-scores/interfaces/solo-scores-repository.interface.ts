import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { SoloScoreEntity } from '@libs/dao/arena/solo-scores/entities/solo-score.entity';
import { SoloScore } from '@libs/dao/arena/solo-scores/interfaces/solo-score.interface';

export interface SoloScoresRepository
  extends AbstractRepositoryInterface<SoloScoreEntity> {
  findByUserId(userId: number): Promise<SoloScore>;
}

export const SoloScoresRepository = Symbol('SoloScoresRepository');
