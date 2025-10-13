import { Module } from '@nestjs/common';
import { PortfolioBlockNumbersModule } from '@libs/dao/batch/portfolio/block-numbers/portfolio-block-numbers.module';
import { PortfolioTopicsModule } from '@libs/dao/batch/portfolio/topics/portfolio-topics.module';
import { PortfolioShapeMintLogsModule } from '@libs/dao/batch/portfolio/shape-mint-logs/portfolio-shape-mint-logs.module';
import { PortfolioShapeEventLogsModule } from '@libs/dao/batch/portfolio/shape-event-logs/portfolio-shape-event-logs.module';
import { PortfolioShapeOwnerLogsModule } from '@libs/dao/batch/portfolio/shape-owner-logs/portfolio-shape-owner-logs.module';
import { PortfolioCoinAirdropQueuesModule } from '@libs/dao/batch/portfolio/coin-airdrop-queues/portfolio-coin-airdrop-queues.module';
import { PortfolioErc1155ClaimMerkleTreeModule } from '@libs/dao/batch/portfolio/erc1155-claim-merkle-tree/portfolio-erc1155-claim-merkle-tree.module';
import { PortfolioErc1155ClaimsModule } from '@libs/dao/batch/portfolio/erc1155-claims/portfolio-erc1155-claims.module';
import {
  PortfolioClaimErc1155LogsModule
} from '@libs/dao/batch/portfolio/claim-erc1155-logs/portfolio-claim-erc1155-logs.module';

@Module({
  imports: [
    PortfolioBlockNumbersModule,
    PortfolioTopicsModule,
    PortfolioShapeMintLogsModule,
    PortfolioShapeEventLogsModule,
    PortfolioShapeOwnerLogsModule,
    PortfolioCoinAirdropQueuesModule,
    PortfolioErc1155ClaimMerkleTreeModule,
    PortfolioErc1155ClaimsModule,
    PortfolioClaimErc1155LogsModule,
  ],
  exports: [
    PortfolioBlockNumbersModule,
    PortfolioTopicsModule,
    PortfolioShapeMintLogsModule,
    PortfolioShapeEventLogsModule,
    PortfolioShapeOwnerLogsModule,
    PortfolioCoinAirdropQueuesModule,
    PortfolioErc1155ClaimMerkleTreeModule,
    PortfolioErc1155ClaimsModule,
    PortfolioClaimErc1155LogsModule,
  ],
})
export class PortfolioBatchModule {}
