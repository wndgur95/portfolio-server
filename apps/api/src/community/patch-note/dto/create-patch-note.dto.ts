import { ApiProperty } from '@nestjs/swagger';

export class CreatePatchNoteInDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  contexts: string;

  @ApiProperty()
  startAt: Date;
}
