import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { PortfolioCoinAirdropQueueEntity } from '@libs/dao/batch/portfolio/coin-airdrop-queues/entities/portfolio-coin-airdrop-queue.entity';
import { CoinAirdropQueuesDbRepository } from '@libs/dao/batch/abstract/coin-airdrop-queues/repositories/coin-airdrop-queues-db.repository';
import { PortfolioCoinAirdropQueuesRepository } from '@libs/dao/batch/portfolio/coin-airdrop-queues/interfaces/portfolio-coin-airdrop-queues-repository.interface';

@EntityRepository(PortfolioCoinAirdropQueueEntity)
export class PortfolioCoinAirdropQueuesDbRepository
  extends CoinAirdropQueuesDbRepository<PortfolioCoinAirdropQueueEntity>
  implements PortfolioCoinAirdropQueuesRepository {}
