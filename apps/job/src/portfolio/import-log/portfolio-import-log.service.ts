import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ProcessProvider } from '../../process/process.provider';
import { ImportLogService } from '../../abstract/import-log/import-log.service';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { PortfolioBatchHttpProvider } from '../../http/portfolio-batch-http.provider';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';

@Injectable()
export class PortfolioImportLogService extends ImportLogService {
  constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly processProvider: ProcessProvider,
    protected readonly portfolioBatchHttpProvider: PortfolioBatchHttpProvider,
  ) {
    super(
      schedulerRegistry,
      NETWORK.PORTFOLIO,
      processProvider,
      portfolioBatchHttpProvider,
      process.env.PORTFOLIO_NETWORK,
      Number(process.env.PORTFOLIO_NETWORK_PORT),
    );
    /** node syncing job 생성*/
    this.createJob(
      `getNodeSyncing`,
      process.env.NODE_ENV == 'prod' ? '*/2 * * * * *' : '*/3 * * * * *',
      () => this.getNodeSyncing(),
    );

    /** topic 에 해당하는 이벤트 로그 적재 TOPIC_TYPE.MINT job 생성*/
    this.createJob(
      `ImportMintLog`,
      process.env.NODE_ENV == 'prod' ? '*/3 * * * * *' : '*/3 * * * * *',
      () => this.importMintLog(),
    );

    /** topic 에 해당하는 이벤트 로그 적재 TOPIC_TYPE.OWNER job 생성*/
    this.createJob(
      `ImportTransferOwnerLog`,
      process.env.NODE_ENV == 'prod' ? '*/3 * * * * *' : '*/3 * * * * *',
      () => this.importTransferOwnerLog(),
    );

    /** topic 에 해당하는 이벤트 로그 적재 TOPIC_TYPE.SHAPE job 생성*/
    this.createJob(
      `ImportShapeLog`,
      process.env.NODE_ENV == 'prod' ? '*/3 * * * * *' : '*/3 * * * * *',
      () => this.importShapeLog(),
    );

    /** topic 에 해당하는 이벤트 로그 적재 TOPIC_TYPE.REAL_OWNER job 생성*/
    // this.createJob(
    //   `ImportShapeRealOwnerLog`,
    //   process.env.NODE_ENV == 'prod' ? '*/3 * * * * *' : '*/3 * * * * *',
    //   () => this.importShapeRealOwnerLog(),
    // );
  }

  getProcess(): JobProcessInfoDto[] {
    return [
      this.getNodeSyncingProcess(),
      this.getImportMintLogProcess(),
      this.getImportTransferOwnerLogProcess(),
      this.getImportShapeLogProcess(),
      // this.getImportShapeRealOwnerLogProcess(),
    ];
  }
}
