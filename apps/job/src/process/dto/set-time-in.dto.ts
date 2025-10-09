import { ApiProperty } from '@nestjs/swagger';

export class SetTimeInDto {
  @ApiProperty()
  startHour: number;

  @ApiProperty()
  endHour: number;
}
