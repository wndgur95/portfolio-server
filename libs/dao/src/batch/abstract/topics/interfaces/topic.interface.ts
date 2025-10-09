import { Domain } from '@libs/common/domain/domain';

export interface Topic extends Domain {
  topic: string;
  name: string;
  enable: number;
  contractId: number;
  topicType: number;
}
