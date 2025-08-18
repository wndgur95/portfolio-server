import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { QuestionEntity } from '@libs/dao/user/questions/entities/question.entity';
import { QuestionsRepository } from '@libs/dao/user/questions/interfaces/questions-repository.interface';

export type QuestionsDbRepositories = Record<string, QuestionsRepository>;

@EntityRepository(QuestionEntity)
export class QuestionsDbRepository
  extends AbstractRepository<QuestionEntity>
  implements QuestionsRepository {}