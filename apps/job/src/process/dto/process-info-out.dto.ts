import { ApiProperty } from '@nestjs/swagger';
import { JobProcessInfoDto } from '../../dto/job-process-info.dto';

export class IsOpenInfo {
  @ApiProperty()
  isOpen: boolean;

  @ApiProperty()
  isTimeOpen: boolean;

  @ApiProperty()
  isJobOpen: boolean;

  constructor(partial?: Partial<IsOpenInfo>) {
    Object.assign(this, partial);
  }

  static of(
    isOpen: boolean,
    isTimeOpen: boolean,
    isJobOpen: boolean,
  ): IsOpenInfo {
    return new IsOpenInfo({
      isOpen: isOpen,
      isTimeOpen: isTimeOpen,
      isJobOpen: isJobOpen,
    });
  }
}

export class ProcessInfoOutDto {
  @ApiProperty()
  process: JobProcessInfoDto[];

  @ApiProperty()
  isOpenInfo: IsOpenInfo;

  constructor(partial?: Partial<ProcessInfoOutDto>) {
    Object.assign(this, partial);
  }

  static of(
    process: JobProcessInfoDto[],
    isOpenInfo: IsOpenInfo,
  ): ProcessInfoOutDto {
    return new ProcessInfoOutDto({
      process: process,
      isOpenInfo: isOpenInfo,
    });
  }
}
