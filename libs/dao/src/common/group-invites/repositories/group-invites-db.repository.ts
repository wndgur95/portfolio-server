import { EntityRepository } from '@libs/common/databases/typeorm/typeorm-ex.decorator'
import { AbstractRepository } from '@libs/common/databases/typeorm/abstract.repository';
import { GroupInviteEntity } from '@libs/dao/common/group-invites/entities/group-invite.entity';
import { GroupInvitesRepository } from '@libs/dao/common/group-invites/interfaces/group-invites-repository.interface';

@EntityRepository(GroupInviteEntity)
export class GroupInvitesDbRepository
  extends AbstractRepository<GroupInviteEntity>
  implements GroupInvitesRepository {}