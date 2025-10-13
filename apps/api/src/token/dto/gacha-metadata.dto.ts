import { ApiProperty } from '@nestjs/swagger';
import { DataGachaToken } from '@libs/dao/static/data-gacha-token/data-gacha-token.entity';
import { S_TOKEN_GACHA_TYPE } from '@libs/common/constants/contract.contstants';

export class GachaAttributeDto {
  @ApiProperty()
  trait_type: string;

  @ApiProperty()
  value: string;

  constructor(partial?: Partial<GachaAttributeDto>) {
    Object.assign(this, partial);
  }
}

export class GachaMetadataDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  gachaType: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  external_url?: string;

  @ApiProperty({ type: GachaAttributeDto, isArray: true })
  attributes: GachaAttributeDto[];

  constructor(partial?: Partial<GachaMetadataDto>) {
    Object.assign(this, partial);
  }

  static of(
    form: any,
    gachaData: DataGachaToken,
    attributes: GachaAttributeDto[],
  ): GachaMetadataDto {
    const tokenId = Number(gachaData.ID);
    return new GachaMetadataDto({
      id: tokenId,
      name: gachaData.NAME,
      description: `${gachaData.NAME} 로 뽑기를 해보세요.`,
      gachaType: S_TOKEN_GACHA_TYPE[gachaData.GACHA_TYPE],
      image: `${process.env.TOKEN_IMAGE_UTL}/gacha/${tokenId}`,
      attributes: attributes,
      external_url: form.external_url,
    });
  }
}
