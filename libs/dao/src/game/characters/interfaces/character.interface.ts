import { Domain } from '@libs/common/domain/domain';

export interface Character extends Domain {
  userId: number;
  dataCharacterId: number;
  level: number;
  count: number;
}
