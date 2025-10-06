import { Domain } from '@libs/common/domain/domain';

export interface Shape extends Domain {
  owner: string;
  userId: number;
  shapeId: number;
  exp: number;
  level: number;
  color: string;
  tokenId?: number;
  status: string;
}