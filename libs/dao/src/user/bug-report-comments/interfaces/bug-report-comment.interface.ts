import { Domain } from '@libs/common/domain/domain';
import { BugCommenter } from '@libs/common/constants/community.constants';

export interface BugReportComment extends Domain {
  bugReportId: number;
  commenter: BugCommenter;
  comment: string;
}
