import { Module } from '@nestjs/common';
import { PortfolioBlockNumbersModule } from '@libs/dao/batch/portfolio/block-numbers/portfolio-block-numbers.module';
import { PortfolioTopicsModule } from '@libs/dao/batch/portfolio/topics/portfolio-topics.module';
import { PortfolioShapeMintLogsModule } from '@libs/dao/batch/portfolio/shape-mint-logs/portfolio-shape-mint-logs.module';
import { PortfolioShapeEventLogsModule } from '@libs/dao/batch/portfolio/shape-event-logs/portfolio-shape-event-logs.module';
import { PortfolioShapeOwnerLogsModule } from '@libs/dao/batch/portfolio/shape-owner-logs/portfolio-shape-owner-logs.module';
import { PortfolioCoinAirdropQueuesModule } from '@libs/dao/batch/portfolio/coin-airdrop-queues/portfolio-coin-airdrop-queues.module';

@Module({
  imports: [
    PortfolioBlockNumbersModule,
    PortfolioTopicsModule,
    PortfolioShapeMintLogsModule,
    PortfolioShapeEventLogsModule,
    PortfolioShapeOwnerLogsModule,
    PortfolioCoinAirdropQueuesModule,
  ],
  exports: [
    PortfolioBlockNumbersModule,
    PortfolioTopicsModule,
    PortfolioShapeMintLogsModule,
    PortfolioShapeEventLogsModule,
    PortfolioShapeOwnerLogsModule,
    PortfolioCoinAirdropQueuesModule,
  ],
})
export class PortfolioBatchModule {}
