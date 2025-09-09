import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { SoloScoreHistoryEntity } from "@libs/dao/arena/solo-score-histories/entities/solo-score-history.entity";

export interface SoloScoreHistoriesRepository extends AbstractRepositoryInterface<SoloScoreHistoryEntity> {}

export const SoloScoreHistoriesRepository = Symbol('SoloScoreHistoriesRepository');