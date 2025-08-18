import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { KnowHowRecommendEntity } from "@libs/dao/user/know-how-recommends/entities/know-how-recommend.entity";

export interface KnowHowRecommendsRepository extends AbstractRepositoryInterface<KnowHowRecommendEntity> {}

export const KnowHowRecommendsRepository = Symbol('KnowHowRecommendsRepository');