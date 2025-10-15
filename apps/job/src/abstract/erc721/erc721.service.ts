import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BaseJobService } from '../../default/base-job.service';
import { BaseJobDto } from '../../default/base-job.dto';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';
import { LOG_STATUS } from '@libs/common/constants/contract.contstants';
import { ShapeOwnerLogProvider } from '@libs/dao/batch/common/shape-owner-log/shape-owner-log.provider';
import { ShapeMintLogProvider } from '@libs/dao/batch/common/shape-mint-log/shape-mint-log.provider';
import { ShapeEventLogProvider } from '@libs/dao/batch/common/shape-event-log/shape-event-log.provider';

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

    protected readonly shapeOwnerLogProvider: ShapeOwnerLogProvider,
    protected readonly shapeMintLogProvider: ShapeMintLogProvider,
    protected readonly shapeEventLogProvider: ShapeEventLogProvider,
  ) {
    super(schedulerRegistry, network, processProvider);
  }

  protected async shapeTransferOwner(): Promise<void> {
    await this.startJob(this.shapeTransferOwnerDto, [
      (): Promise<void> => this._shapeTransferOwner(),
    ]);
  }

  protected async shapeGacha(): Promise<void> {
    await this.startJob(this.shapeGachaDto, [
      (): Promise<void> => this._shapeGacha(),
    ]);
  }

  protected async setShapeId(): Promise<void> {
    await this.startJob(this.setShapeIdDto, [
      (): Promise<void> => this.batchHttpProvider.setShapeId(),
    ]);
  }

  private async _shapeTransferOwner(): Promise<void> {
    const logCount =
      await this.shapeOwnerLogProvider.repository.countByStatus(
        LOG_STATUS.REGISTERED,
      );
    if (!logCount) return;
    await this.batchHttpProvider.transferOwner();
  }

  private async _shapeGacha(): Promise<void> {
    const logCount =
      await this.shapeMintLogProvider.repository.countByStatus(
        LOG_STATUS.REGISTERED,
      );
    if (!logCount) return;
    await this.batchHttpProvider.gachaShape();
  }

  private async _setShapeId(): Promise<void> {
    const logCount =
      await this.shapeEventLogProvider.repository.countByStatus(
        LOG_STATUS.REGISTERED,
      );
    if (!logCount) return;
    await this.batchHttpProvider.setShapeId();
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
