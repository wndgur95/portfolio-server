import { Inject, Injectable } from '@nestjs/common';
import { BaseBatchTableProvider } from '@libs/dao/batch/abstract/base-batch-table.provider';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { PortfolioCoinAirdropQueuesDbRepository } from '@libs/dao/batch/portfolio/coin-airdrop-queues/repositories/portfolio-coin-airdrop-queues-db.repository';
import { PortfolioCoinAirdropQueuesRepository } from '@libs/dao/batch/portfolio/coin-airdrop-queues/interfaces/portfolio-coin-airdrop-queues-repository.interface';
import { PortfolioCoinAirdropQueueEntity } from '@libs/dao/batch/portfolio/coin-airdrop-queues/entities/portfolio-coin-airdrop-queue.entity';

@Injectable()
export class CoinAirdropQueueProvider extends BaseBatchTableProvider<
  PortfolioCoinAirdropQueuesDbRepository,
  null,
  null
> {
  constructor(
    @Inject(PortfolioCoinAirdropQueuesRepository)
    protected readonly portfolioCoinAirdropQueuesRepository: PortfolioCoinAirdropQueuesDbRepository,
  ) {
    super(portfolioCoinAirdropQueuesRepository);
  }

  createEntity(dto): PortfolioCoinAirdropQueueEntity {
    switch (ContextProvider.getNetwork()) {
      case NETWORK.PORTFOLIO: {
        return new PortfolioCoinAirdropQueueEntity(dto);
      }
    }
  }
}
