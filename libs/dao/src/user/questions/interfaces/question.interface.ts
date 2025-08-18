import { Domain } from '@libs/common/domain/domain';

export interface Question extends Domain {
  userId: number;
  question: string;
  answer?: string;
}
