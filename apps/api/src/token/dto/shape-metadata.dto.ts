import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { ConstantsValidator } from '@libs/common/validator/constants.validator';
import { SHAPE_STATUS } from '@libs/common/constants/contract.contstants';
import { Shape } from '@libs/dao/contract/shapes/interfaces/shape.interface';
import { DataShapeToken } from '@libs/dao/static/data-shape-token/data-shape-token.entity';

export class ShapeAttributeDto {
  @ApiProperty()
  trait_type: string;

  @ApiProperty()
  value: string;

  constructor(partial?: Partial<ShapeAttributeDto>) {
    Object.assign(this, partial);
  }
}

export class ShapeMetadataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  shape_id: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  external_url?: string;

  @ApiProperty({ type: ShapeAttributeDto, isArray: true })
  attributes: ShapeAttributeDto[];

  @ApiProperty()
  @Validate(ConstantsValidator, [SHAPE_STATUS])
  status: string;

  constructor(partial?: Partial<ShapeMetadataDto>) {
    Object.assign(this, partial);
  }

  static of(
    form: any,
    shape: Shape,
    shapeData: DataShapeToken,
    attributes: ShapeAttributeDto[],
  ): ShapeMetadataDto {
    return new ShapeMetadataDto({
      id: Number(shape.tokenId),
      name: shapeData.NAME,
      description: `${shapeData.NAME} 도형을 성장 시켜보세요.`,
      shape_id: shape.shapeId,
      image: '',
      status: shape.status,
      attributes: attributes,
      external_url: form.external_url,
    });
  }
}
