import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { RouletteEntity } from '@libs/dao/wedding/roulettes/entities/roulette.entity';

export interface RoulettesRepository
  extends AbstractRepositoryInterface<RouletteEntity> {
  getLastRoulette(): Promise<RouletteEntity | null>;
}

export const RoulettesRepository = Symbol('RoulettesRepository');
