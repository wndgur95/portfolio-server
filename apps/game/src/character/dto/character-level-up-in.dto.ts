import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CharacterLevelUpInDto {
  @ApiProperty()
  @IsNumber()
  dataCharacterId: number;
}
