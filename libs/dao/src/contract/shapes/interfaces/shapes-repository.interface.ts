import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { ShapeEntity } from "@libs/dao/contract/shapes/entities/shape.entity";

export interface ShapesRepository extends AbstractRepositoryInterface<ShapeEntity> {}

export const ShapesRepository = Symbol('ShapesRepository');