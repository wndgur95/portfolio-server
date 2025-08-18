import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { KnowHowCommentEntity } from "@libs/dao/common/know-how-comments/entities/know-how-comment.entity";

export interface KnowHowCommentsRepository extends AbstractRepositoryInterface<KnowHowCommentEntity> {}

export const KnowHowCommentsRepository = Symbol('KnowHowCommentsRepository');