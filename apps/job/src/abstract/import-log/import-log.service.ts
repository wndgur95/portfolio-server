import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BaseJobService } from '../../default/base-job.service';
import { BaseJobDto } from '../../default/base-job.dto';
import { TOPIC_TYPE } from '@libs/common/constants/contract.contstants';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

@Injectable()
export abstract class ImportLogService extends BaseJobService {
  protected importMintLogDto = BaseJobDto.of(false, new Date());
  protected importTransferOwnerLogDto = BaseJobDto.of(false, new Date());
  protected importShapeLogDto = BaseJobDto.of(false, new Date());
  protected importShapeRealOwnerLogDto = BaseJobDto.of(false, new Date());

  protected _web3;

  protected constructor(
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly network: string,
    protected readonly processProvider: any,
    protected readonly batchHttpProvider,
    _network: string,
    _port: number,
  ) {
    super(schedulerRegistry, network, processProvider);
    if (!this._web3) {
      const network = Number(_port) ? `${_network}:${_port}` : `${_network}`;
      this._web3 = new Web3(
        new Web3.providers.HttpProvider(network.toString()),
      );
    }
  }

  private syncingProcessDto = BaseJobDto.of(false, new Date());

  private toBlockNumber = 0;
  private syncing = false;

  async getNodeSyncing(): Promise<void> {
    await this.startJob(this.syncingProcessDto, [
      (): Promise<void> => this.nodeSyncing(),
    ]);
  }

  protected async nodeSyncing(): Promise<void> {
    try {
      // 동기화 상태 확인
      const syncing = await this._web3.eth.isSyncing();
      if (syncing) {
        Logger.log(
          '노드 동기화 중... 현재 블록: ',
          syncing.currentBlock,
          ' 최대 블록: ',
          syncing.highestBlock,
        );
      } else {
        this.toBlockNumber = await this._web3.eth.getBlockNumber();
      }
      this.syncing = !syncing; // 동기화 완료 | 미완료
    } catch (error) {
      Logger.error(this.network, '동기화 상태 확인 중 오류 발생');
      this.syncing = false; // 동기화 미완료
    }
  }

  protected eventLogImport(type: number): any[] {
    return [
      (): Promise<void> =>
        this.batchHttpProvider.eventLogImport(this.toBlockNumber, type),
    ];
  }

  async importMintLog(): Promise<void> {
    if (!this.syncing) return;
    await this.startJob(
      this.importMintLogDto,
      this.eventLogImport(TOPIC_TYPE.MINT),
    );
  }

  async importTransferOwnerLog(): Promise<void> {
    if (!this.syncing) return;
    await this.startJob(
      this.importTransferOwnerLogDto,
      this.eventLogImport(TOPIC_TYPE.OWNER),
    );
  }

  async importShapeLog(): Promise<void> {
    if (!this.syncing) return;
    await this.startJob(
      this.importShapeLogDto,
      this.eventLogImport(TOPIC_TYPE.SHAPE),
    );
  }

  async importShapeRealOwnerLog(): Promise<void> {
    if (!this.syncing) return;
    await this.startJob(
      this.importShapeRealOwnerLogDto,
      this.eventLogImport(TOPIC_TYPE.REAL_OWNER),
    );
  }

  // ---------------------------------------------------------------------

  getNodeSyncingProcess(): JobProcessInfoDto {
    return this.getJob('노드 싱크', this.syncingProcessDto);
  }

  getImportMintLogProcess(): JobProcessInfoDto {
    return this.getJob('도형 민트 로그 수집', this.importMintLogDto);
  }
  getImportTransferOwnerLogProcess(): JobProcessInfoDto {
    return this.getJob(
      '도형 transfer 로그 수집',
      this.importTransferOwnerLogDto,
    );
  }
  getImportShapeLogProcess(): JobProcessInfoDto {
    return this.getJob('도형 컨텐츠 로그 수집', this.importShapeLogDto);
  }
  getImportShapeRealOwnerLogProcess(): JobProcessInfoDto {
    return this.getJob(
      '도형 진짜 주인 변경 로그 수집',
      this.importShapeRealOwnerLogDto,
    );
  }
}
