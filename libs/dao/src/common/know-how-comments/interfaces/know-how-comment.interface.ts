import { Domain } from '@libs/common/domain/domain';

export interface KnowHowComment extends Domain {
  knowHowId: number;
  userId: number;
  commenter: string;
  comment: string;
}
