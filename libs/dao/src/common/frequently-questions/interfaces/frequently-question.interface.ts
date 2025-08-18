import { Domain } from '@libs/common/domain/domain';

export interface FrequentlyQuestion extends Domain {
  question: string;
  answer: string;
}
