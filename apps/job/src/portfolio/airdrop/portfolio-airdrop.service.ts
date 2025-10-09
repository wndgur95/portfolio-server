import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PortfolioBatchHttpProvider } from '../../http/portfolio-batch-http.provider';
import { AirdropService } from '../../abstract/airdrop/airdrop.service';
import { ProcessProvider } from '../../process/process.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';
import { CoinAirdropQueueProvider } from '@libs/dao/batch/common/coin-airdrop-queue/coin-airdrop-queue.provider';

@Injectable()
export class PortfolioAirdropService extends AirdropService {
  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly processProvider: ProcessProvider,
    protected readonly portfolioBatchHttpProvider: PortfolioBatchHttpProvider,

    protected readonly coinAirdropQueueProvider: CoinAirdropQueueProvider,
  ) {
    super(
      schedulerRegistry,
      NETWORK.PORTFOLIO,
      processProvider,
      portfolioBatchHttpProvider,

      coinAirdropQueueProvider,
    );

    /** 에어드랍 코인 job 생성*/
    this.createJob(
      `AirdropCoin`,
      process.env.NODE_ENV == 'prod' ? '*/3 * * * * *' : '*/3 * * * * *',
      () => this.airdropCoin(),
    );
  }

  getProcess(): JobProcessInfoDto[] {
    return [this.getAirdropCoinProcess()];
  }
}
