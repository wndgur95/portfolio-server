import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { TopicsRepository } from '@libs/dao/batch/abstract/topics/interfaces/topics-repository.interface';

export abstract class TopicsDbRepository<T>
  extends AbstractRepository<T>
  implements TopicsRepository<T>
{
  async findTopicByName(name: string): Promise<T> {
    return await this.queryBuilder
      .where(`${this.alias}.name=:name`, { name: name })
      .getOne();
  }

  async findTopicByNames(names: string[]): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.name IN (:...names)`, { names: names })
      .getMany();
  }

  async findTopicActive(): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.enable=:enable`, { enable: 1 })
      .getMany();
  }

  async findTopicsByTopicType(topicType: number): Promise<T[]> {
    return await this.queryBuilder
      .where(`${this.alias}.topicType=:topicType`, {
        topicType: topicType,
      })
      .andWhere(`${this.alias}.enable=:enable`, { enable: 1 })
      .getMany();
  }

  async findTopicByTopicType(topicType: number): Promise<T> {
    return await this.queryBuilder
      .where(`${this.alias}.topicType=:topicType`, {
        topicType: topicType,
      })
      .andWhere(`${this.alias}.enable=:enable`, { enable: 1 })
      .getOne();
  }
}
