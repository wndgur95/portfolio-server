import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { NumberMetadataDto } from '../../token/dto/number-metadata.dto';

export class GetNumberTokenOutDto extends BaseOutDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  numberTokens: NumberMetadataDto[];
}
