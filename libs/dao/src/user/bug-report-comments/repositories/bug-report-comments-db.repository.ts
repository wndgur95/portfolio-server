import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { BugReportCommentEntity } from '@libs/dao/user/bug-report-comments/entities/bug-report-comment.entity';
import { BugReportCommentsRepository } from '@libs/dao/user/bug-report-comments/interfaces/bug-report-comments-repository.interface';

export type BugReportCommentsDbRepositories = Record<string, BugReportCommentsRepository>;

@EntityRepository(BugReportCommentEntity)
export class BugReportCommentsDbRepository
  extends AbstractRepository<BugReportCommentEntity>
  implements BugReportCommentsRepository {}