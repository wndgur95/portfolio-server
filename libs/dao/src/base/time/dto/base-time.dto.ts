import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from "@libs/dao/base/base.dto";

export class BaseTimeDto<T> extends BaseDto<T> {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
