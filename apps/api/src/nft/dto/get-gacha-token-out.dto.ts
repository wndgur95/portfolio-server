import { ApiProperty } from '@nestjs/swagger';
import { GachaMetadataDto } from '../../token/dto/gacha-metadata.dto';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class GetGachaTokenOutDto extends BaseOutDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  gachaTokens: GachaMetadataDto[];
}
