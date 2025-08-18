import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { RouletteEntity } from '@libs/dao/wedding/roulettes/entities/roulette.entity';
import { RoulettesRepository } from '@libs/dao/wedding/roulettes/interfaces/roulettes-repository.interface';

@EntityRepository(RouletteEntity)
export class RoulettesDbRepository
  extends AbstractRepository<RouletteEntity>
  implements RoulettesRepository
{
  async getLastRoulette(): Promise<RouletteEntity | null> {
    // 1. 업데이트할 항목 조회 (가장 빠른 ID 하나만)
    return await this.queryBuilder
      .select()
      .orderBy(`${this.alias}.id`, 'DESC')
      .limit(1)
      .getOne();
  }
}
