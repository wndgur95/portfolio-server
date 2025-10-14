import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BaseJobService } from '../../default/base-job.service';
import { BaseJobDto } from '../../default/base-job.dto';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';

@Injectable()
export abstract class Erc721Service extends BaseJobService {
  protected shapeTransferOwnerDto = BaseJobDto.of(false, new Date());
  protected shapeGachaDto = BaseJobDto.of(false, new Date());
  protected setShapeIdDto = BaseJobDto.of(false, new Date());

  protected constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly network: string,
    protected readonly processProvider,
    protected readonly batchHttpProvider,
  ) {
    super(schedulerRegistry, network, processProvider);
  }

  protected async shapeTransferOwner(): Promise<void> {
    await this.startJob(this.shapeTransferOwnerDto, [
      (): Promise<void> => this.batchHttpProvider.transferOwner(),
    ]);
  }

  protected async shapeGacha(): Promise<void> {
    await this.startJob(this.shapeGachaDto, [
      (): Promise<void> => this.batchHttpProvider.gachaShape(),
    ]);
  }

  protected async setShapeId(): Promise<void> {
    await this.startJob(this.setShapeIdDto, [
      (): Promise<void> => this.batchHttpProvider.setShapeId(),
    ]);
  }

  // ---------------------------------------------------------------------
  protected getShapeTransferOwnerProcess(): JobProcessInfoDto {
    return this.getJob('도형 소유자 변경', this.shapeTransferOwnerDto);
  }

  protected getShapeGachaProcess(): JobProcessInfoDto {
    return this.getJob('도형 가챠', this.shapeGachaDto);
  }

  protected getSetShapeIdProcess(): JobProcessInfoDto {
    return this.getJob('도형 id 주입', this.setShapeIdDto);
  }
}
