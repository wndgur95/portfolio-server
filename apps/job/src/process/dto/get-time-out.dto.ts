import { ApiProperty } from '@nestjs/swagger';

export class GetTimeOutDto {
  @ApiProperty()
  currentHour: number;

  @ApiProperty()
  startHour: number;

  @ApiProperty()
  endHour: number;

  constructor(partial?: Partial<GetTimeOutDto>) {
    Object.assign(this, partial);
  }

  static of(
    currentHour: number,
    startHour: number,
    endHour: number,
  ): GetTimeOutDto {
    return new GetTimeOutDto({
      currentHour: currentHour,
      startHour: startHour,
      endHour: endHour,
    });
  }
}
