import { ApiProperty } from '@nestjs/swagger';

export class BaseJobDto {
  @ApiProperty()
  isProcess: boolean;

  @ApiProperty()
  lastTime: Date;

  constructor(partial?: Partial<BaseJobDto>) {
    Object.assign(this, partial);
  }

  static of(isProcess: boolean, lastTime: Date): BaseJobDto {
    return new BaseJobDto({
      isProcess: isProcess,
      lastTime: lastTime,
    });
  }
}
