import { Domain } from '@libs/common/domain/domain';

export interface DeveloperNote extends Domain {
  title: string;
  functionalImprovement?: string;
  futurePlan?: string;
  developerMessage?: string;
  startAt: Date;
}
