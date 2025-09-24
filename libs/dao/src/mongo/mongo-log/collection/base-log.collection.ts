import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ContextProvider } from '@libs/common/provider/context.provider';

export class BaseLogCollection {
  @ApiProperty({ required: false })
  @IsString()
  reason?: string;

  @ApiProperty({ required: false })
  @IsString()
  addReason: string;

  @ApiProperty()
  time: Date;

  constructor(partial?: Partial<BaseLogCollection>) {
    if (partial.reason) {
      ContextProvider.setReason(partial.reason);
    }

    this.reason = ContextProvider.getReason();
    this.addReason = ContextProvider.getAddReason();
    this.time = ContextProvider.getNow();

    Object.assign(this, partial);
  }
}
