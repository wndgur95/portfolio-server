import { Domain } from '@libs/common/domain/domain';

export interface IdeaComment extends Domain {
  ideaId: number;
  userId: number;
  commenter: string;
  comment: string;
}
