import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { IdeaEntity } from '@libs/dao/common/ideas/entities/idea.entity';
import { IdeasRepository } from '@libs/dao/common/ideas/interfaces/ideas-repository.interface';

@EntityRepository(IdeaEntity)
export class IdeasDbRepository
  extends AbstractRepository<IdeaEntity>
  implements IdeasRepository {}