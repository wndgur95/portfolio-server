import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { BattleEntity } from '@libs/dao/game/battles/entities/battle.entity';
import { BattlesRepository } from '@libs/dao/game/battles/interfaces/battles-repository.interface';
import { Battle } from '@libs/dao/game/battles/interfaces/battle.interface';

export type BattlesDbRepositories = Record<string, BattlesRepository>;

@EntityRepository(BattleEntity)
export class BattlesDbRepository
  extends AbstractRepository<BattleEntity>
  implements BattlesRepository
{
  async findByUserId(userId: number): Promise<Battle> {
    return await this.queryBuilder
      .where(`${this.alias}.userId = :userId`, { userId: userId })
      .getOne();
  }
}
