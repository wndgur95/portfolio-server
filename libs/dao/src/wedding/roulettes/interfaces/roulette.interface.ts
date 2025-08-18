import { Domain } from '@libs/common/domain/domain';

export interface Roulette extends Domain {
  bride: number;
  groom: number;
  pool: string;
  exception: string;
}
