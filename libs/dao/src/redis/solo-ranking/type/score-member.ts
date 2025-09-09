import { SoloScoreDto } from '@libs/dao/arena/solo-scores/dto/solo-score.dto';

export class ScoreMember {
  userId: number;
  score: number;
  rank?: number;

  static create(partial?: Partial<ScoreMember>): ScoreMember {
    return Object.assign(new ScoreMember(), partial);
  }
}


export class ScoreMemberDetail extends SoloScoreDto {
  rank?: number;

  static create(partial?: Partial<ScoreMemberDetail>): ScoreMemberDetail {
    return Object.assign(new ScoreMemberDetail(), partial);
  }
}
