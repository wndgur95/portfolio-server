import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { IdeaDoItEntity } from '@libs/dao/user/idea-do-its/entities/idea-do-it.entity';
import { IdeaDoItsRepository } from '@libs/dao/user/idea-do-its/interfaces/idea-do-its-repository.interface';

export type IdeaDoItsDbRepositories = Record<string, IdeaDoItsRepository>;

@EntityRepository(IdeaDoItEntity)
export class IdeaDoItsDbRepository
  extends AbstractRepository<IdeaDoItEntity>
  implements IdeaDoItsRepository {}