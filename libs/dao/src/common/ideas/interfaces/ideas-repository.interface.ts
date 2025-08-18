import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { IdeaEntity } from "@libs/dao/common/ideas/entities/idea.entity";

export interface IdeasRepository extends AbstractRepositoryInterface<IdeaEntity> {}

export const IdeasRepository = Symbol('IdeasRepository');