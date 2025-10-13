import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BaseJobService } from '../../default/base-job.service';
import { BaseJobDto } from '../../default/base-job.dto';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';
import { CLAIM_STATUS, LOG_STATUS } from '@libs/common/constants/contract.contstants';

@Injectable()
export abstract class Erc1155Service extends BaseJobService {
  protected erc1155MakeMerkleTreeDto = BaseJobDto.of(false, new Date());
  protected erc1155SetMerkleTreeDto = BaseJobDto.of(false, new Date());
  protected claimErc1155Dto = BaseJobDto.of(false, new Date());

  protected constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly network: string,
    protected readonly processProvider,
    protected readonly batchHttpProvider,

    protected readonly erc1155ClaimMerkleTreeProvider,
    protected readonly erc1155ClaimProvider,
    protected readonly claimErc1155LogProvider,
  ) {
    super(schedulerRegistry, network, processProvider);
  }

  protected async erc1155MakeMerkleTree(): Promise<void> {
    await this.startJob(this.erc1155MakeMerkleTreeDto, [
      (): Promise<void> => this._erc1155MakeMerkleTree(),
    ]);
  }

  protected async erc1155SetMerkleTree(): Promise<void> {
    await this.startJob(this.erc1155SetMerkleTreeDto, [
      (): Promise<void> => this._erc1155SetMerkleTree(),
    ]);
  }

  protected async claimErc1155(): Promise<void> {
    await this.startJob(this.claimErc1155Dto, [
      (): Promise<void> => this._claimErc1155(),
    ]);
  }

  private async _erc1155MakeMerkleTree(): Promise<void> {
    const logCount =
      await this.erc1155ClaimProvider.repository.countByStatus(
        CLAIM_STATUS.REGISTERED,
      );
    if (!logCount) return;
    await this.batchHttpProvider.erc1155MakeMerkleTree();
  }

  private async _erc1155SetMerkleTree(): Promise<void> {
    const logCount =
      await this.erc1155ClaimMerkleTreeProvider.repository.countByStatus(
        LOG_STATUS.REGISTERED,
      );
    if (!logCount) return;
    await this.batchHttpProvider.erc1155SetMerkleTree();
  }

  private async _claimErc1155(): Promise<void> {
    const logCount =
      await this.claimErc1155LogProvider.repository.countByStatus(
        LOG_STATUS.REGISTERED,
      );
    if (!logCount) return;
    await this.batchHttpProvider.claimErc1155();
  }

  // ---------------------------------------------------------------------
  protected getErc1155MakeMerkleTreeProcess(): JobProcessInfoDto {
    return this.getJob('erc1155 머클트리 생성', this.erc1155MakeMerkleTreeDto);
  }

  protected getErc1155SetMerkleTreeProcess(): JobProcessInfoDto {
    return this.getJob('erc1155 머클트리 주입', this.erc1155SetMerkleTreeDto);
  }

  protected getClaimErc1155Process(): JobProcessInfoDto {
    return this.getJob('erc1155 에어드랍 완료', this.claimErc1155Dto);
  }
}
