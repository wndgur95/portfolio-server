import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { ShapeEntity } from '@libs/dao/contract/shapes/entities/shape.entity';
import { ShapesRepository } from '@libs/dao/contract/shapes/interfaces/shapes-repository.interface';

@EntityRepository(ShapeEntity)
export class ShapesDbRepository
  extends AbstractRepository<ShapeEntity>
  implements ShapesRepository {}