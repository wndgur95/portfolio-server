import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';

export interface TopicsRepository<T> extends AbstractRepositoryInterface<T> {
  findTopicByName(name: string): Promise<T>;
  findTopicByNames(names: string[]): Promise<T[]>;
  findTopicActive(): Promise<T[]>;
  findTopicsByTopicType(topicType: number): Promise<T[]>;
  findTopicByTopicType(topicType: number): Promise<T>;
}

export const TopicsRepository = Symbol('TopicsRepository');
