import { PortfolioCoinAirdropQueueEntity } from '@libs/dao/batch/portfolio/coin-airdrop-queues/entities/portfolio-coin-airdrop-queue.entity';
import { CoinAirdropQueuesRepository } from '@libs/dao/batch/abstract/coin-airdrop-queues/interfaces/coin-airdrop-queues-repository.interface';

// export interface PortfolioCoinAirdropQueuesRepository extends CoinAirdropQueuesRepository<PortfolioCoinAirdropQueueEntity> {}
export type PortfolioCoinAirdropQueuesRepository =
  CoinAirdropQueuesRepository<PortfolioCoinAirdropQueueEntity>;

export const PortfolioCoinAirdropQueuesRepository = Symbol(
  'PortfolioCoinAirdropQueuesRepository',
);
