import { Domain } from '@libs/common/domain/domain';

export interface IdeaDoIt extends Domain {
  ideaId: number;
  userId: number;
  doIt: boolean;
}
