import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { FrequentlyQuestionEntity } from '@libs/dao/common/frequently-questions/entities/frequently-question.entity';
import { FrequentlyQuestionsRepository } from '@libs/dao/common/frequently-questions/interfaces/frequently-questions-repository.interface';

@EntityRepository(FrequentlyQuestionEntity)
export class FrequentlyQuestionsDbRepository
  extends AbstractRepository<FrequentlyQuestionEntity>
  implements FrequentlyQuestionsRepository {}