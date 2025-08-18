import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { KnowHowEntity } from '@libs/dao/common/know-hows/entities/know-how.entity';
import { KnowHowsRepository } from '@libs/dao/common/know-hows/interfaces/know-hows-repository.interface';

@EntityRepository(KnowHowEntity)
export class KnowHowsDbRepository
  extends AbstractRepository<KnowHowEntity>
  implements KnowHowsRepository {}