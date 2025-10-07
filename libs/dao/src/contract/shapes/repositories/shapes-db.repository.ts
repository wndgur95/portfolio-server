import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { ShapeEntity } from '@libs/dao/contract/shapes/entities/shape.entity';
import { ShapesRepository } from '@libs/dao/contract/shapes/interfaces/shapes-repository.interface';
import { Shape } from '@libs/dao/contract/shapes/interfaces/shape.interface';

@EntityRepository(ShapeEntity)
export class ShapesDbRepository
  extends AbstractRepository<ShapeEntity>
  implements ShapesRepository
{
  async findByTokenId(tokenId: number): Promise<Shape> {
    return await this.queryBuilder
      .where(`${this.alias}.tokenId = :tokenId`, { tokenId: tokenId })
      .getOne();
  }
}
