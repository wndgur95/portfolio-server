import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { ShapeMetadataDto } from '../../token/dto/shape-metadata.dto';

export class GetShapeTokenOutDto extends BaseOutDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  shapeTokens: ShapeMetadataDto[];
}
