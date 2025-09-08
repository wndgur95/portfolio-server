import { MISSION_STEP_TYPE } from '@libs/dao/static/common.constants';
import { StaticBaseRepository } from '@libs/dao/static/static-base.repository';

export abstract class BaseAchievementProvider {
  /**
   * 미션 query filter 조건 추가
   */
  getMissionFilter(data: any): boolean {
    switch (data.MISSION_STEP_TYPE) {
      case MISSION_STEP_TYPE.CUMULATE: {
        // 누적미션일 땐 처음꺼만 가져오기
        return data.IS_ROOT;
      }
      default: {
        return true;
      }
    }
  }

  /**
   * 다음 미션이 있으면 다음 미션 찾기
   */
  getNextMissionData<T>(
    dataRepository: StaticBaseRepository<T>,
    data: any,
    prevCount: number,
  ): T {
    if (
      data.MISSION_STEP_TYPE != MISSION_STEP_TYPE.CUMULATE ||
      !data.NEXT_MISSION_ENUM_ID
    ) {
      return;
    }

    const nextMission = dataRepository.findById(data.NEXT_MISSION_ENUM_ID);

    return {
      ...nextMission,
      prevCount: prevCount, // 사용 시점에만 추가로 사용할 수 있음
    };
  }
}
