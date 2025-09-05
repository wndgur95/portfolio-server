import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BattleFinishInDto {
  @ApiProperty()
  @IsString()
  battleUid: string;

  @ApiProperty()
  @IsNumber()
  time: number;

  @ApiProperty()
  @IsNumber()
  kill: number;
}
