import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator';
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { GroupEntity } from '@libs/dao/common/groups/entities/group.entity';
import { GroupsRepository } from '@libs/dao/common/groups/interfaces/groups-repository.interface';
import { getDatabaseByGroupDbId } from '@libs/dao/config/group/group-database-config.util';
import { ContextProvider } from '@libs/common/provider/context.provider';

@EntityRepository(GroupEntity)
export class GroupsDbRepository
  extends AbstractRepository<GroupEntity>
  implements GroupsRepository
{
  async findById(id: number): Promise<GroupEntity> {
    const group = await this.queryBuilder
      .where(`${this.alias}.id=:id`, { id: id })
      .getOne();

    if (group.groupDbId) {
      const database = getDatabaseByGroupDbId(group.groupDbId);
      ContextProvider.setGroupDatabase(database);
    }

    return group;
  }
}
