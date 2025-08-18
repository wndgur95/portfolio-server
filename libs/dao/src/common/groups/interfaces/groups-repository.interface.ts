import { AbstractRepositoryInterface } from "@libs/common/databases/typeorm/abstract-repository.interface";
import { GroupEntity } from "@libs/dao/common/groups/entities/group.entity";

export interface GroupsRepository extends AbstractRepositoryInterface<GroupEntity> {}

export const GroupsRepository = Symbol('GroupsRepository');