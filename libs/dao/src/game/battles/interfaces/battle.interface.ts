import { Domain } from '@libs/common/domain/domain';

export interface Battle extends Domain {
  userId: number;
  dataCharacterId: number;
  level: number;
  battleUid: string;
}
