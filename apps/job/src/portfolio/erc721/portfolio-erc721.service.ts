import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PortfolioBatchHttpProvider } from '../../http/portfolio-batch-http.provider';
import { NETWORK } from '@libs/common/constants/web3.constants';
import { ProcessProvider } from '../../process/process.provider';
import { Erc721Service } from '../../abstract/erc721/erc721.service';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';

@Injectable()
export class PortfolioErc721Service extends Erc721Service {
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
    );

    /** 도형 owner 변경 job 생성*/
    this.createJob(
      `ShapeTransferOwner`,
      process.env.NODE_ENV == 'prod' ? '*/1 * * * * *' : '*/1 * * * * *',
      () => this.shapeTransferOwner(),
    );

    /** 도형 가챠 job 생성*/
    this.createJob(
      `ShapeGacha`,
      process.env.NODE_ENV == 'prod' ? '*/1 * * * * *' : '*/1 * * * * *',
      () => this.shapeGacha(),
    );

    /** 도형 id 주입 job 생성*/
    this.createJob(
      `SetShapeId`,
      process.env.NODE_ENV == 'prod' ? '*/1 * * * * *' : '*/1 * * * * *',
      () => this.setShapeId(),
    );
  }

  getProcess(): JobProcessInfoDto[] {
    return [
      this.getShapeTransferOwnerProcess(),
      this.getShapeGachaProcess(),
      this.getSetShapeIdProcess(),
    ];
  }
}
