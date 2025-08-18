import { Column, Entity } from 'typeorm';
import {
  AbstractEntity,
  BaseTimeEntity,
} from '@libs/common/databases/typeorm/abstract.entity';
import { Question } from '@libs/dao/user/questions/interfaces/question.interface';

@Entity('question')
@BaseTimeEntity()
export class QuestionEntity extends AbstractEntity implements Question {
  @Column()
  userId: number;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text', nullable: true })
  answer: string;
}
