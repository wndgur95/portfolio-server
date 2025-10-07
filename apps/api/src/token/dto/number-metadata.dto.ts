import { ApiProperty } from '@nestjs/swagger';
import { DataNumberToken } from '@libs/dao/static/data-number-token/data-number-token.entity';

export class NumberAttributeDto {
  @ApiProperty()
  trait_type: string;

  @ApiProperty()
  value: string;

  constructor(partial?: Partial<NumberAttributeDto>) {
    Object.assign(this, partial);
  }
}

export class NumberMetadataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  external_url?: string;

  @ApiProperty({ type: NumberAttributeDto, isArray: true })
  attributes: NumberAttributeDto[];

  constructor(partial?: Partial<NumberMetadataDto>) {
    Object.assign(this, partial);
  }

  static of(
    form: any,
    numberData: DataNumberToken,
    attributes: NumberAttributeDto[],
  ): NumberMetadataDto {
    return new NumberMetadataDto({
      id: Number(numberData.ID),
      name: numberData.NAME,
      description: `${numberData.NAME} 로 도형을 성장 시켜보세요.`,
      image: '',
      attributes: attributes,
      external_url: form.external_url,
    });
  }
}
