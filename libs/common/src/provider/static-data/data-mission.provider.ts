import { Injectable } from '@nestjs/common';
import { DataMissionRepository } from '@libs/dao/static/data-mission/data-mission.repository';
import { DataMission } from '@libs/dao/static/data-mission/data-mission.entity';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';

@Injectable()
export class DataMissionProvider {
  constructor(private readonly dataMissionRepository: DataMissionRepository) {}

  /**
   * 단일 미션 데이터 조회
   */
  getDataMission(id: number): DataMission {
    const dataMission = this.dataMissionRepository.findById(id);

    if (!dataMission) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `${id}는 미션 데이터에 존재하지 않은 아이디 입니다.`,
      ]);
    }

    return dataMission;
  }

  /**
   * 다중 미션 데이터 조회
   */
  getDataMissions(ids: number[]): DataMission[] {
    const dataMissions = this.dataMissionRepository.findByIdIn(ids);

    if (dataMissions.length !== ids.length) {
      throw new ServerErrorException(INTERNAL_ERROR_CODE.DATA_INVALID, [
        `요청된 ID 중 누락된 미션 데이터가 있습니다. 요청된 ID: ${ids.join(', ')}, 조회된 데이터 수: ${dataMissions.length}`,
      ]);
    }

    return dataMissions;
  }

  /**
   * 이전 단계 미션 데이터 조회
   */
  getPrevStepDataMission(id: number): DataMission {
    const dataMissions = this.dataMissionRepository.query({
      NEXT_MISSION_ENUM_ID: [id],
    });

    if (dataMissions.length > 1) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.DATA_INVALID,
        [`이전 단계 미션 데이터가 2개 이상 존재합니다.`],
      );
    }

    return dataMissions[0];
  }

  /**
   * 이전 단계 미션 데이터 조회
   */
  getCurrentAndPrevStepDataMission(ids: number[]): DataMission[] {
    const dataPrevStepMissions = this.dataMissionRepository.query({
      NEXT_MISSION_ENUM_ID: ids,
    });

    const dataMissions = this.dataMissionRepository.findByIdIn(ids);

    return [...dataPrevStepMissions, ...dataMissions];
  }
}
