import { TopicsRepository } from '@libs/dao/batch/abstract/topics/interfaces/topics-repository.interface';
import { PortfolioTopicEntity } from '@libs/dao/batch/portfolio/topics/entities/portfolio-topic.entity';

// export interface PortfolioTopicsRepository extends TopicsRepository<PortfolioTopicEntity> {}
export type PortfolioTopicsRepository = TopicsRepository<PortfolioTopicEntity>;

export const PortfolioTopicsRepository = Symbol('PortfolioTopicsRepository');
