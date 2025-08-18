import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { WeddingMessageEntity } from '@libs/dao/wedding/wedding-messages/entities/wedding-message.entity';
import { WeddingMessagesRepository } from '@libs/dao/wedding/wedding-messages/interfaces/wedding-messages-repository.interface';

@EntityRepository(WeddingMessageEntity)
export class WeddingMessagesDbRepository
  extends AbstractRepository<WeddingMessageEntity>
  implements WeddingMessagesRepository
{
  async findAllAndCount(
    take: number,
    skip: number,
    orderBy: 'ASC' | 'DESC',
  ): Promise<[WeddingMessageEntity[], number]> {
    return await this.queryBuilder
      .take(take)
      .skip(skip)
      .orderBy(`${this.alias}.id`, orderBy)
      .getManyAndCount();
  }
}
