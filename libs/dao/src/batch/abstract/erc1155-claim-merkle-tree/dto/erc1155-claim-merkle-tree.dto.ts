import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { LogStatus } from '@libs/common/constants/contract.contstants';

@EntitySerializeImpl()
export abstract class Erc1155ClaimMerkleTreeDto<
  T,
> extends ExcludeBaseTimeDto<T> {
  @ApiProperty({ required: true })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  treeRoot: string;

  @ApiProperty({ required: false })
  @IsNumber()
  status: LogStatus;
}
