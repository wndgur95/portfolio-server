import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { IdeaCommentEntity } from "@libs/dao/common/idea-comments/entities/idea-comment.entity";

export interface IdeaCommentsRepository extends AbstractRepositoryInterface<IdeaCommentEntity> {}

export const IdeaCommentsRepository = Symbol('IdeaCommentsRepository');