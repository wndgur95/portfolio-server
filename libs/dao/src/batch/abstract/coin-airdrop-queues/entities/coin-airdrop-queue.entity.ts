import { Column, Index } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { CoinAirdropQueue } from '@libs/dao/batch/abstract/coin-airdrop-queues/interfaces/coin-airdrop-queue.interface';
import {
  LOG_STATUS,
  LogStatus,
} from '@libs/common/constants/contract.contstants';

@BaseTimeEntity()
export abstract class CoinAirdropQueueEntity
  extends AbstractEntity
  implements CoinAirdropQueue
{
  @Column()
  userId: number;

  @Index('IDX_ADDRESS', { unique: true })
  @Column()
  address: string;

  @Index()
  @Column({ type: 'tinyint', default: LOG_STATUS.REGISTERED })
  status: LogStatus;

  @Column({ nullable: true })
  receivedAt: Date;

  constructor(partial: Partial<CoinAirdropQueue>) {
    super();
    Object.assign(this, partial);
  }
}
