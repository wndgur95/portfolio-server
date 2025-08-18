import { ApiProperty } from '@nestjs/swagger';

export class UpdatePatchNoteInDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  contexts: string;

  @ApiProperty()
  startAt: Date;
}
