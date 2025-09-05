import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { BattleEntity } from '@libs/dao/game/battles/entities/battle.entity';
import { Battle } from '@libs/dao/game/battles/interfaces/battle.interface';

export interface BattlesRepository
  extends AbstractRepositoryInterface<BattleEntity> {
  findByUserId(userId: number): Promise<Battle>;
}

export const BattlesRepository = Symbol('BattlesRepository');
