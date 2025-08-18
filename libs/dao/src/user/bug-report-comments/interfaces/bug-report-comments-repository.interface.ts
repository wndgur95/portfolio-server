import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { BugReportCommentEntity } from "@libs/dao/user/bug-report-comments/entities/bug-report-comment.entity";

export interface BugReportCommentsRepository extends AbstractRepositoryInterface<BugReportCommentEntity> {}

export const BugReportCommentsRepository = Symbol('BugReportCommentsRepository');