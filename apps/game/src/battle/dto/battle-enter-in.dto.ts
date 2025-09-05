import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BattleEnterInDto {
  @ApiProperty()
  @IsNumber()
  dataCharacterId: number;

  @ApiProperty()
  @IsNumber()
  level: number;
}
