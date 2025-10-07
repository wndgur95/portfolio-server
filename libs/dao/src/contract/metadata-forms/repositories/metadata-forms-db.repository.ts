import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { MetadataFormEntity } from '@libs/dao/contract/metadata-forms/entities/metadata-form.entity';
import { MetadataFormsRepository } from '@libs/dao/contract/metadata-forms/interfaces/metadata-forms-repository.interface';
import { MetadataForm } from '@libs/dao/contract/metadata-forms/interfaces/metadata-form.interface';

@EntityRepository(MetadataFormEntity)
export class MetadataFormsDbRepository
  extends AbstractRepository<MetadataFormEntity>
  implements MetadataFormsRepository
{
  async findByName(name: string): Promise<MetadataForm> {
    return await this.queryBuilder
      .where(`${this.alias}.name=:name`, { name: name })
      .getOne();
  }
}
