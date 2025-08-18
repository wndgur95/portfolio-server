import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ApiProperty } from '@nestjs/swagger';

export class WeddingMessageOutDto extends BaseOutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  context: string;

  @ApiProperty()
  createdAt: number;
}

@EntitySerializeImpl()
export class GetWeddingMessageOutDto extends BaseOutDto {
  @ApiProperty({ type: WeddingMessageOutDto, isArray: true })
  weddingMessages: WeddingMessageOutDto[];
}
