import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { SoloScoreHistoryEntity } from "@libs/dao/arena/solo-score-histories/entities/solo-score-history.entity";

export type SoloScoreHistoriesRepository = AbstractRepositoryInterface<SoloScoreHistoryEntity>

export const SoloScoreHistoriesRepository = Symbol('SoloScoreHistoriesRepository');