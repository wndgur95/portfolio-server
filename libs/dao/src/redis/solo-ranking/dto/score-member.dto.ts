import { SoloScoreDto } from '@libs/dao/arena/solo-scores/dto/solo-score.dto';

export class ScoreMemberDto {
  userId: number;
  score: number;
  rank?: number;

  static create(partial?: Partial<ScoreMemberDto>): ScoreMemberDto {
    return Object.assign(new ScoreMemberDto(), partial);
  }
}


export class ScoreMemberDetail extends SoloScoreDto {
  rank?: number;

  static create(partial?: Partial<ScoreMemberDetail>): ScoreMemberDetail {
    return Object.assign(new ScoreMemberDetail(), partial);
  }
}
