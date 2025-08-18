import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { KnowHowRecommendEntity } from '@libs/dao/user/know-how-recommends/entities/know-how-recommend.entity';
import { KnowHowRecommendsRepository } from '@libs/dao/user/know-how-recommends/interfaces/know-how-recommends-repository.interface';

export type KnowHowRecommendsDbRepositories = Record<string, KnowHowRecommendsRepository>;

@EntityRepository(KnowHowRecommendEntity)
export class KnowHowRecommendsDbRepository
  extends AbstractRepository<KnowHowRecommendEntity>
  implements KnowHowRecommendsRepository {}