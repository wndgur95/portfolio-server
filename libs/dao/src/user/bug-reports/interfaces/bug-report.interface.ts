import { Domain } from '@libs/common/domain/domain';
import { BugStatus, BugType } from '@libs/common/constants/community.constants';

export interface BugReport extends Domain {
  userId: number;
  type: BugType;
  status: BugStatus;
  title: string;
  contexts: string;
}
