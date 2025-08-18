import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuestionInDto {
  @ApiProperty()
  question: string;
}
