import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { TopicsDbRepository } from '@libs/dao/batch/abstract/topics/repositories/topics-db.repository';
import { PortfolioTopicEntity } from '@libs/dao/batch/portfolio/topics/entities/portfolio-topic.entity';
import {
  PortfolioTopicsRepository
} from '@libs/dao/batch/portfolio/topics/interfaces/portfolio-topics-repository.interface';

@EntityRepository(PortfolioTopicEntity)
export class PortfolioTopicsDbRepository
  extends TopicsDbRepository<PortfolioTopicEntity>
  implements PortfolioTopicsRepository {}