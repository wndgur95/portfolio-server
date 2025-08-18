import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { FrequentlyQuestion } from '@libs/dao/common/frequently-questions/interfaces/frequently-question.interface';

@Entity('frequently_question')
@BaseTimeEntity()
export class FrequentlyQuestionEntity
  extends AbstractEntity
  implements FrequentlyQuestion
{
  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text', nullable: true })
  answer: string;
}
