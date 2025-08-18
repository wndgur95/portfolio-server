import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeveloperNoteInDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  functionalImprovement?: string;

  @ApiProperty({ required: false })
  futurePlan?: string;

  @ApiProperty({ required: false })
  developerMessage?: string;

  @ApiProperty()
  startAt: Date;
}
