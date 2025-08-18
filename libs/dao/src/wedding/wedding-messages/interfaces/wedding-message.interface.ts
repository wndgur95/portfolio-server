import { Domain } from '@libs/common/domain/domain';

export interface WeddingMessage extends Domain {
  name: string;
  context: string;
}
