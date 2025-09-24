import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ContextProvider } from '@libs/common/provider/context.provider';

export class BaseLogCollection {
  @ApiProperty({ required: false })
  @IsString()
  reason: string;

  @ApiProperty()
  time: Date;

  constructor(partial?: Partial<BaseLogCollection>) {
    Object.assign(this, partial);

    this.time = ContextProvider.getNow();
  }
}
