import { Exclude } from 'class-transformer';
import { BaseDto } from "@libs/dao/base/base.dto";

export class ExcludeBaseTimeDto<T> extends BaseDto<T> {
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
