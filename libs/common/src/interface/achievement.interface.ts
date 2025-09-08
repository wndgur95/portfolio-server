import { MissionConditionType } from '@libs/dao/static/common.constants';

export interface Achievement {
  missionConditionType: MissionConditionType;
  conditions: number[];
  count: number;
}
