import { Domain } from '@libs/common/domain/domain';

export interface TestTable extends Domain {
  contents?: string;
  count: number;
}
