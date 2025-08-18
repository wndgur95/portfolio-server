import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/common/dto/base-out.dto';
import { FrequentlyQuestion } from '@libs/dao/common/frequently-questions/interfaces/frequently-question.interface';
import { Question } from '@libs/dao/user/questions/interfaces/question.interface';

export class GetQuestionOutDto extends BaseOutDto {
  @ApiProperty()
  frequentlyQuestions: FrequentlyQuestion[];

  @ApiProperty()
  questions: Question[];
}
