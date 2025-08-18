import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { BugReportComment } from '@libs/dao/user/bug-report-comments/interfaces/bug-report-comment.interface';
import { BugCommenter } from '@libs/common/constants/community.constants';

@Entity('bug_report_comment')
@BaseTimeEntity()
export class BugReportCommentEntity
  extends AbstractEntity
  implements BugReportComment
{
  @Index()
  @Column()
  bugReportId: number;

  @Column({ type: 'tinyint' })
  commenter: BugCommenter;

  @Column()
  comment: string;
}
