import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { GroupInviteEntity } from "@libs/dao/common/group-invites/entities/group-invite.entity";

export interface GroupInvitesRepository extends AbstractRepositoryInterface<GroupInviteEntity> {}

export const GroupInvitesRepository = Symbol('GroupInvitesRepository');