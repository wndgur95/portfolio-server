import { Entity } from 'typeorm';
import { BaseTimeEntity } from '@libs/common/databases/typeorm/abstract.entity';
import { TopicEntity } from '@libs/dao/batch/abstract/topics/entities/topic.entity';
import { PortfolioTopic } from '@libs/dao/batch/portfolio/topics/interfaces/portfolio-topic.interface';

@Entity('portfolio_topic')
@BaseTimeEntity()
export class PortfolioTopicEntity
  extends TopicEntity
  implements PortfolioTopic {}
