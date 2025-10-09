import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BaseJobService } from '../../default/base-job.service';
import { BaseJobDto } from '../../default/base-job.dto';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';
import { LOG_STATUS } from '@libs/common/constants/contract.contstants';

@Injectable()
export abstract class AirdropService extends BaseJobService {
  protected airdropCoinDto = BaseJobDto.of(false, new Date());

  protected constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly network: string,
    protected readonly processProvider,
    protected readonly batchHttpProvider,

    protected readonly coinAirdropQueueProvider,
  ) {
    super(schedulerRegistry, network, processProvider);
  }

  protected async airdropCoin(): Promise<void> {
    await this.startJob(this.airdropCoinDto, [
      (): Promise<void> => this._airdropCoin(),
    ]);
  }

  private async _airdropCoin(): Promise<void> {
    const logCount =
      await this.coinAirdropQueueProvider.repository.countByStatus(
        LOG_STATUS.REGISTERED,
      );
    if (!logCount) return;
    await this.batchHttpProvider.airdropCoin();
  }

  // ---------------------------------------------------------------------
  protected getAirdropCoinProcess(): JobProcessInfoDto {
    return this.getJob('코인 에러드랍', this.airdropCoinDto);
  }
}
