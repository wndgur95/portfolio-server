import { Domain } from '@libs/common/domain/domain';

export interface SoloScoreHistory extends Domain {
  userId: number;
  score: number;
  dataCharacterId: number;
  level: number;
  battleEndAt: Date;
}