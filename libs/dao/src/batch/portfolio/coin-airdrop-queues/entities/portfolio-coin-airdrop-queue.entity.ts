import { Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { PortfolioCoinAirdropQueue } from '@libs/dao/batch/portfolio/coin-airdrop-queues/interfaces/portfolio-coin-airdrop-queue.interface';
import { CoinAirdropQueueEntity } from '@libs/dao/batch/abstract/coin-airdrop-queues/entities/coin-airdrop-queue.entity';

@Entity('portfolio_coin_airdrop_queue')
@BaseTimeEntity()
export class PortfolioCoinAirdropQueueEntity
  extends CoinAirdropQueueEntity
  implements PortfolioCoinAirdropQueue {}
