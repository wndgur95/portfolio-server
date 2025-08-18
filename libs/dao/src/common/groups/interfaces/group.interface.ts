import { Domain } from '@libs/common/domain/domain';

export interface Group extends Domain {
  name: string;
  image?: string;
  memberCount: number;
  desc: string;
  groupDbId: number;
}
