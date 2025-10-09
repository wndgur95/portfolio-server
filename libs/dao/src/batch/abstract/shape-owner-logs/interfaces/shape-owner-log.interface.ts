import { Domain } from '@libs/common/domain/domain';

export interface ShapeOwnerLog extends Domain {
  address: string;
  secondTopic: string;
  thirdTopic: string;
  data: any;
  blockNumber: number;
  status: number;
  contractId: number;
  topicId: number;
}
