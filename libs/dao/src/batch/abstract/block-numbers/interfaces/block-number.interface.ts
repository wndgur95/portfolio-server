import { Domain } from '@libs/common/domain/domain';

export interface BlockNumber extends Domain {
  blockNumber: number;
  topicType: number;
}
