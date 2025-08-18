import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionInDto {
  @ApiProperty()
  question: string;
}
