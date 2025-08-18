import { ApiProperty } from '@nestjs/swagger';

export class MakeRouletteInDto {
  @ApiProperty()
  password: string;

  @ApiProperty()
  bride: number;

  @ApiProperty()
  groom: number;
}
