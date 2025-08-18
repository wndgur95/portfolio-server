import { Column, Entity, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { BugReport } from '@libs/dao/user/bug-reports/interfaces/bug-report.interface';
import { BugStatus, BugType } from '@libs/common/constants/community.constants';

@Entity('bug_report')
@BaseTimeEntity()
export class BugReportEntity extends AbstractEntity implements BugReport {
  @Column()
  userId: number;

  @Index()
  @Column({ type: 'tinyint', default: BugType.None })
  type: BugType;

  @Index()
  @Column({ type: 'tinyint', default: BugStatus.Waiting })
  status: BugStatus;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  contexts: string;
}
