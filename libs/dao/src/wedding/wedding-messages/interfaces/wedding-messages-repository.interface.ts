import { AbstractRepositoryInterface } from '@libs/common/databases/typeorm/abstract-repository.interface';
import { WeddingMessageEntity } from '@libs/dao/wedding/wedding-messages/entities/wedding-message.entity';
import { WeddingMessage } from '@libs/dao/wedding/wedding-messages/interfaces/wedding-message.interface';

export interface WeddingMessagesRepository
  extends AbstractRepositoryInterface<WeddingMessageEntity> {
  findAllAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
  ): Promise<[WeddingMessage[], number]>;
}
// export type WeddingMessagesRepository = AbstractRepositoryInterface<WeddingMessageEntity>

export const WeddingMessagesRepository = Symbol('WeddingMessagesRepository');
