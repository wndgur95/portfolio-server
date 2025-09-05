import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';

export class BattleEnterOutDto extends BaseOutDto {
  @ApiProperty()
  @IsString()
  battleUid: string;
}
