import { Domain } from '@libs/common/domain/domain';

export interface KnowHow extends Domain {
  userId: number;
  nickname: string;
  title: string;
  contexts: string;
}
