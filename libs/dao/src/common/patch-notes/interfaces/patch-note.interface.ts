import { Domain } from '@libs/common/domain/domain';

export interface PatchNote extends Domain {
  title: string;
  contexts: string;
  startAt: Date;
}
