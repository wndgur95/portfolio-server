import { Domain } from '@libs/common/domain/domain';
import { LogStatus } from '@libs/common/constants/contract.contstants';

export interface CoinAirdropQueue extends Domain {
  userId: number;
  address: string;
  status: LogStatus;
  receivedAt: Date;
}
