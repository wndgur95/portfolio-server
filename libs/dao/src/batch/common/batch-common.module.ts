import { Module } from '@nestjs/common';
import { BlockNumberProvider } from '@libs/dao/batch/common/block-number/block-number.provider';
import { PortfolioBatchModule } from '@libs/dao/batch/portfolio/portfolio-batch.module';
import { TopicProvider } from '@libs/dao/batch/common/topic/topic.provider';
import { ShapeMintLogProvider } from '@libs/dao/batch/common/shape-mint-log/shape-mint-log.provider';
import { ShapeEventLogProvider } from '@libs/dao/batch/common/shape-event-log/shape-event-log.provider';
import { ShapeOwnerLogProvider } from '@libs/dao/batch/common/shape-owner-log/shape-owner-log.provider';
import { CoinAirdropQueueProvider } from '@libs/dao/batch/common/coin-airdrop-queue/coin-airdrop-queue.provider';

@Module({
  imports: [PortfolioBatchModule],
  providers: [
    BlockNumberProvider,
    TopicProvider,
    ShapeMintLogProvider,
    ShapeEventLogProvider,
    ShapeOwnerLogProvider,
    CoinAirdropQueueProvider,
  ],
  exports: [
    PortfolioBatchModule,
    BlockNumberProvider,
    TopicProvider,
    ShapeMintLogProvider,
    ShapeEventLogProvider,
    ShapeOwnerLogProvider,
    CoinAirdropQueueProvider,
  ],
})
export class BatchCommonModule {}
