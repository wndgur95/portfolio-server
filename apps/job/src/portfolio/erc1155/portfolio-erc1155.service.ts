import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PortfolioBatchHttpProvider } from '../../http/portfolio-batch-http.provider';
import { AirdropService } from '../../abstract/airdrop/airdrop.service';
import { ProcessProvider } from '../../process/process.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';
import { CoinAirdropQueueProvider } from '@libs/dao/batch/common/coin-airdrop-queue/coin-airdrop-queue.provider';
import { Erc1155ClaimMerkleTreeProvider } from '@libs/dao/batch/common/erc1155-claim-merkle-tree/erc1155-claim-merkle-tree.provider';
import { Erc1155ClaimProvider } from '@libs/dao/batch/common/erc1155-claim/erc1155-claim.provider';
import { Erc1155Service } from '../../abstract/erc1155/erc1155.service';

@Injectable()
export class PortfolioErc1155Service extends Erc1155Service {
  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly processProvider: ProcessProvider,
    protected readonly portfolioBatchHttpProvider: PortfolioBatchHttpProvider,

    protected readonly erc1155ClaimMerkleTreeProvider: Erc1155ClaimMerkleTreeProvider,
    protected readonly erc1155ClaimProvider: Erc1155ClaimProvider,
  ) {
    super(
      schedulerRegistry,
      NETWORK.PORTFOLIO,
      processProvider,
      portfolioBatchHttpProvider,

      erc1155ClaimMerkleTreeProvider,
      erc1155ClaimProvider,
    );

    /** erc1155 머클트리 생성 job 생성*/
    this.createJob(
      `Erc1155MakeMerkleTree`,
      process.env.NODE_ENV == 'prod' ? '*/3 * * * * *' : '*/3 * * * * *',
      () => this.erc1155MakeMerkleTree(),
    );

    /** erc1155 머클트리 주입 job 생성*/
    this.createJob(
      `Erc1155SetMerkleTree`,
      process.env.NODE_ENV == 'prod' ? '*/3 * * * * *' : '*/3 * * * * *',
      () => this.erc1155SetMerkleTree(),
    );
  }

  getProcess(): JobProcessInfoDto[] {
    return [
      this.getErc1155MakeMerkleTreeProcess(),
      this.getErc1155SetMerkleTreeProcess(),
    ];
  }
}
