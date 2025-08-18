import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { IdeaCommentEntity } from '@libs/dao/common/idea-comments/entities/idea-comment.entity';
import { IdeaCommentsRepository } from '@libs/dao/common/idea-comments/interfaces/idea-comments-repository.interface';

@EntityRepository(IdeaCommentEntity)
export class IdeaCommentsDbRepository
  extends AbstractRepository<IdeaCommentEntity>
  implements IdeaCommentsRepository {}