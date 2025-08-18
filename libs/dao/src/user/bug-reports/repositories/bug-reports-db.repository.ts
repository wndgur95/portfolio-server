import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { BugReportEntity } from '@libs/dao/user/bug-reports/entities/bug-report.entity';
import { BugReportsRepository } from '@libs/dao/user/bug-reports/interfaces/bug-reports-repository.interface';

export type BugReportsDbRepositories = Record<string, BugReportsRepository>;

@EntityRepository(BugReportEntity)
export class BugReportsDbRepository
  extends AbstractRepository<BugReportEntity>
  implements BugReportsRepository {}