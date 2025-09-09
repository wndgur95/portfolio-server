import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ScoreMemberDetail } from '@libs/dao/redis/solo-ranking/type/score-member';

export class GetSoloRankingOutDto extends BaseOutDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  myRanking: ScoreMemberDetail;

  @ApiProperty()
  ranking: ScoreMemberDetail[];
}
