import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { ShapeEntity } from '@libs/dao/contract/shapes/entities/shape.entity';
import { Shape } from '@libs/dao/contract/shapes/interfaces/shape.interface';

export interface ShapesRepository
  extends AbstractRepositoryInterface<ShapeEntity> {
  findByTokenId(tokenId: number): Promise<Shape>;
  findByUserId(userId: number): Promise<Shape[]>;
  findByAddress(address: string): Promise<Shape[]>;
  findByTokenIds(tokenIds: number[]): Promise<Shape[]>;
}

export const ShapesRepository = Symbol('ShapesRepository');
