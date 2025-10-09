import { ApiProperty } from '@nestjs/swagger';

export class JobProcessInfoDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  process: boolean;

  @ApiProperty()
  lastProcess: Date;

  constructor(partial?: Partial<JobProcessInfoDto>) {
    Object.assign(this, partial);
  }

  static of(
    name: string,
    process: boolean,
    lastProcess: Date,
  ): JobProcessInfoDto {
    return new JobProcessInfoDto({
      name: name,
      process: process,
      lastProcess: lastProcess,
    });
  }
}
