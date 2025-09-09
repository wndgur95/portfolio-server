import { Domain } from '@libs/common/domain/domain';

export interface SoloScore extends Domain {
  userId: number;
  score: number;
  gameCount: number;
  dataCharacterId: number;
  level: number;
  lastBattleAt: Date;
}