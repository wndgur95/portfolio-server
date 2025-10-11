import { ApiProperty } from '@nestjs/swagger';
import { ClaimType } from '@libs/common/constants/token.constants';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class Erc1155ClaimOutDto extends BaseOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  claimType: ClaimType;

  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  round: number;

  @ApiProperty()
  proof: string[];
}
