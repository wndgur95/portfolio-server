import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { SajuResultEntity } from '@libs/dao/saju/entities/saju-result.entity';

@EntityRepository(SajuResultEntity)
export class SajuResultDbRepository extends AbstractRepository<SajuResultEntity> {
  async findByShareKey(shareKey: string): Promise<SajuResultEntity | null> {
    return await this.queryBuilder
      .where(`${this.alias}.shareKey = :shareKey`, { shareKey })
      .getOne();
  }

  async incrementViewCount(shareKey: string): Promise<void> {
    await this.queryBuilder
      .update(SajuResultEntity)
      .set({ viewCount: () => 'view_count + 1' })
      .where('shareKey = :shareKey', { shareKey })
      .execute();
  }
}
