import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { IdeaDoItEntity } from "@libs/dao/user/idea-do-its/entities/idea-do-it.entity";

export interface IdeaDoItsRepository extends AbstractRepositoryInterface<IdeaDoItEntity> {}

export const IdeaDoItsRepository = Symbol('IdeaDoItsRepository');