import { DataMissionEnum } from '@libs/dao/static/data-mission/data-mission.enum';

export class DataMission extends DataMissionEnum {
  MISSION_TYPE: number;
  MISSION_STEP_TYPE: number;
  NEXT_MISSION_ENUM_ID: number;
  IS_ROOT: number;
  MISSION_CONDITION_TYPE: number;
  CONDITION_VALUE: number[];
  CONDITION_COUNT: number;
  MISSION_REWARD: number;
}
