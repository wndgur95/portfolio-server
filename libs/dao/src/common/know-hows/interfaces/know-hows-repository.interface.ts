import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { KnowHowEntity } from "@libs/dao/common/know-hows/entities/know-how.entity";

export interface KnowHowsRepository extends AbstractRepositoryInterface<KnowHowEntity> {}

export const KnowHowsRepository = Symbol('KnowHowsRepository');