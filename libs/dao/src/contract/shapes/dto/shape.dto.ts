import { EntitySerializeImpl } from '@libs/dao/base/entity-serialize.decorator';
import { ExcludeBaseTimeDto } from '@libs/dao/base/time/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

@EntitySerializeImpl()
export class ShapeDto extends ExcludeBaseTimeDto<ShapeDto> {
  @ApiProperty()
  owner: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  shapeId: number;

  @ApiProperty()
  exp: number;

  @ApiProperty()
  level: number;

  @ApiProperty()
  color: string;

  @ApiProperty()
  tokenId?: number;

  @ApiProperty()
  status: string;

  setOwner(owner: string): this {
    this.owner = owner;
    return this;
  }
}
