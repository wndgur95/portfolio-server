import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ClaimStatus } from '@libs/common/constants/contract.contstants';
import { ApiProperty } from '@nestjs/swagger';
import { ClaimType } from '@libs/common/constants/token.constants';

@EntitySerializeImpl()
export abstract class Erc1155ClaimDto<T> extends ExcludeBaseTimeDto<T> {
  @ApiProperty()
  address: string;

  @ApiProperty()
  claimType: ClaimType;

  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  treeRound: number;

  @ApiProperty()
  treeProof: string;

  @ApiProperty()
  status: ClaimStatus;
}
