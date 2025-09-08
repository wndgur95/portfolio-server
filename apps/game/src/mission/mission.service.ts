import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { MissionsDbRepositories } from '@libs/dao/game/missions/repositories/missions-db.repository';
import { MissionsRepository } from '@libs/dao/game/missions/interfaces/missions-repository.interface';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';
import { MissionDto } from '@libs/dao/game/missions/dto/mission.dto';
import { Transactional } from '@libs/common/decorator/transaction.decorator';
import { ReceiveRewardInDto } from './dto/receive-reward-in.dto';
import { ReceiveRewardOutDto } from './dto/receive-reward-out.dto';
import { MissionProvider } from '@libs/common/provider/contents/mission.provider';
import { DataMission } from '@libs/dao/static/data-mission/data-mission.entity';
import { DataMissionProvider } from '@libs/common/provider/static-data/data-mission.provider';
import { MISSION_TYPE_PROPS } from '@libs/common/constants/achievement.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import {
  MISSION_CONDITION_TYPE,
  MISSION_STEP_TYPE,
  MISSION_TYPE,
  MissionConditionType,
  MissionType,
} from '@libs/dao/static/common.constants';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';

@Injectable()
export class MissionService {
  constructor(
    @Inject(MissionsRepository)
    private readonly missionsDbRepositories: MissionsDbRepositories,

    private readonly missionProvider: MissionProvider,
    private readonly dataMissionProvider: DataMissionProvider,
    private readonly goodsProvider: GoodsProvider,
  ) {}

  async testMission(): Promise<void> {
    AchievementProvider.achieve(MISSION_CONDITION_TYPE.BATTLE, [], 1);
  }

  /**
   * 미션 정보 받기
   */
  async getMissions(): Promise<Mission[]> {
    const { database, userId } = ContextProvider.getSession();

    const missions =
      await this.missionsDbRepositories[database].findByUserId(userId);

    return MissionDto.fromEntities(missions);
  }

  /**
   * 미션 보상 받기
   */
  @Transactional()
  async receiveReward(
    receiveRewardInDto: ReceiveRewardInDto,
  ): Promise<ReceiveRewardOutDto> {
    const now = ContextProvider.getNow();

    const { dataMissionIds } = receiveRewardInDto;

    const missions =
      await this.missionProvider.getMissionsByDataMissionIds(dataMissionIds);

    const missionByDataMissionId = Object.fromEntries(
      missions.map((it) => [it.dataMissionId, it]),
    );

    // 미션 보상 데이터 아이디 조회 및 미션 포인트, 길드 공헌도 업데이트
    const dataRewardIds = dataMissionIds.map((dataMissionId) => {
      const dataMission =
        this._checkMissionPropsAndGetDataMission(dataMissionId);
      if (
        dataMission.MISSION_STEP_TYPE === MISSION_STEP_TYPE.CUMULATE &&
        !dataMission.IS_ROOT
      ) {
        this._checkCumulatePrevMission(dataMission.ID, missionByDataMissionId);
      }

      const mission = missionByDataMissionId[dataMission.ID];

      // 보상 수령 가능 확인
      this._checkReceiveMissionReward(mission, dataMission.CONDITION_COUNT);

      if (dataMission.MISSION_TYPE == MISSION_TYPE.REPETITION) {
        // update reward
        mission.count = 0;
      } else {
        // update reward
        mission.rewardAt = now;
      }

      return dataMission.MISSION_REWARD;
    });

    // 보상 지급
    const goodsOutDto = await this.goodsProvider.pay(dataRewardIds);

    // 미션 업데이트
    await this.missionProvider.upsertMission(missions);

    return ReceiveRewardOutDto.of({
      mission: MissionDto.fromEntities(missions),
      goods: goodsOutDto,
    });
  }

  /**
   * 확인
   */
  private _checkMissionPropsAndGetDataMission(
    dataMissionId: number,
  ): DataMission {
    const dataMission = this.dataMissionProvider.getDataMission(dataMissionId);

    if (!MISSION_TYPE_PROPS[dataMission.MISSION_TYPE]) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.MISSION_UNKNOWN_TYPE);
    }

    return dataMission;
  }

  private _checkCumulatePrevMission(
    dataMissionId: number,
    missionByDataMissionId: Record<number, Mission>,
  ): void {
    const prevDataMission =
      this.dataMissionProvider.getPrevStepDataMission(dataMissionId);

    if (!prevDataMission) {
      return;
    }

    if (!missionByDataMissionId[prevDataMission.ID]?.rewardAt) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.MISSION_PREV_REWARD_NOT_RECEIVED,
        [`${prevDataMission.ID} is not rewarded`],
      );
    }
  }

  /**
   * 미션 보상 수령 확인
   */
  private _checkReceiveMissionReward(
    mission: Mission,
    missionCount: number,
  ): void {
    if (!mission) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.MISSION_NOT_FOUND);
    }

    if (mission.rewardAt) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.MISSION_ALREADY_RECEIVE_REWARD,
      );
    }

    if (mission.count < missionCount) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.MISSION_NOT_CLEARED);
    }
  }
}
