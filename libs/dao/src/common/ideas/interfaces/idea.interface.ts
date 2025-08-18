import { Domain } from '@libs/common/domain/domain';

export interface Idea extends Domain {
  userId: number;
  nickname: string;
  title: string;
  contexts: string;
}
