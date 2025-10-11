import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ClaimType } from '@libs/common/constants/token.constants';

export class Erc1155ProofInDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  claimType: ClaimType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
