import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { BugReportEntity } from "@libs/dao/user/bug-reports/entities/bug-report.entity";

export interface BugReportsRepository extends AbstractRepositoryInterface<BugReportEntity> {}

export const BugReportsRepository = Symbol('BugReportsRepository');