import { Domain } from '@libs/common/domain/domain';

export interface KnowHowRecommend extends Domain {
  knowHowId: number;
  userId: number;
  recommend: boolean;
}
