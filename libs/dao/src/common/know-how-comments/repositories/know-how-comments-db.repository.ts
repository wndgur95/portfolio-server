import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { KnowHowCommentEntity } from '@libs/dao/common/know-how-comments/entities/know-how-comment.entity';
import { KnowHowCommentsRepository } from '@libs/dao/common/know-how-comments/interfaces/know-how-comments-repository.interface';

@EntityRepository(KnowHowCommentEntity)
export class KnowHowCommentsDbRepository
  extends AbstractRepository<KnowHowCommentEntity>
  implements KnowHowCommentsRepository {}