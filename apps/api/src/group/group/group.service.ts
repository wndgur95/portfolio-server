import { Inject, Injectable } from '@nestjs/common';
import { GroupsRepository } from '@libs/dao/common/groups/interfaces/groups-repository.interface';
import { GroupMembersRepository } from '@libs/dao/common/group-members/interfaces/group-members-repository.interface';
import { GetGroupOutDto } from './dto/get-group.dto';
import { CreateGroupInDto, CreateGroupOutDto } from './dto/create-group.dto';
import { GroupEntity } from '@libs/dao/common/groups/entities/group.entity';
import { TransactionalEx } from '@libs/common/decorator/transaction.decorator';
import { getGroupShardDatabases } from '@libs/dao/config/group/group-database-config.util';
import { GroupMemberEntity } from '@libs/dao/common/group-members/entities/group-member.entity';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { GROUP_MEMBER_ROLES } from '@libs/common/constants/role.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { UpdateGroupInDto, UpdateGroupOutDto } from './dto/update-group.dto';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { In } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @Inject(GroupMembersRepository)
    private readonly groupMembersRepository: GroupMembersRepository,

    @Inject(GroupsRepository)
    private readonly groupsRepository: GroupsRepository,
  ) {}

  async getGroup(userId: number): Promise<GetGroupOutDto> {
    const meGroupMembers = await this.groupMembersRepository.findBy({ userId });

    const groupIds = meGroupMembers.map((it) => it.groupId);

    const groups = await this.groupsRepository.findByIdIn(groupIds);
    const groupMembers = await this.groupMembersRepository.findBy({
      groupId: In(groupIds),
    });

    return GetGroupOutDto.of({
      groupMembers,
      groups,
    });
  }

  @TransactionalEx(DB_NAME.COMMON)
  async createGroup(
    user: User,
    createGroupInDto: CreateGroupInDto,
  ): Promise<CreateGroupOutDto> {
    const group = await this.groupsRepository.save(
      GroupEntity.create({
        ...createGroupInDto,
        memberCount: 1,
      }),
    );

    group.groupDbId = 100 + (group.id % getGroupShardDatabases.length);

    await this.groupsRepository.updateById(group.id, {
      groupDbId: group.groupDbId,
    });

    const groupMember = await this.groupMembersRepository.save(
      GroupMemberEntity.create({
        groupId: group.id,
        userId: user.id,
        name: user.name,
        role: GROUP_MEMBER_ROLES.MASTER,
        signUpAt: ContextProvider.getNow(),
      }),
    );

    return CreateGroupOutDto.of({
      group,
      groupMember,
    });
  }

  @TransactionalEx(DB_NAME.COMMON)
  async updateGroup(
    user: User,
    groupId: number,
    updateGroupInDto: UpdateGroupInDto,
  ): Promise<UpdateGroupOutDto> {
    const { name, image, desc } = updateGroupInDto;

    const groupMember = await this.groupMembersRepository.findOneBy({
      userId: user.id,
      groupId: groupId,
    });

    if (groupMember.role != GROUP_MEMBER_ROLES.MASTER) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.GROUP_MEMBER_ROLE_INVALID,
        ['마스터'],
      );
    }

    const group = await this.groupsRepository.findById(groupId);

    group.name = name;
    if (image) group.image = image;
    group.desc = desc;

    await this.groupsRepository.updateById(groupId, {
      name,
      ...(image ? { image } : {}),
      desc,
    });

    return UpdateGroupOutDto.of({
      group,
    });
  }

  @TransactionalEx(DB_NAME.COMMON)
  async deleteGroup(user: User, groupId: number): Promise<void> {
    const group = await this.groupsRepository.findById(groupId);
    const groupMember = await this.groupMembersRepository.findOneBy({
      userId: user.id,
      groupId: groupId,
    });

    if (
      group.memberCount > 1 &&
      groupMember.role == GROUP_MEMBER_ROLES.MASTER
    ) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.GROUP_MEMBER_ROLE_INVALID,
        [GROUP_MEMBER_ROLES.MEMBER],
      );
    }

    await this.groupMembersRepository.delete({
      userId: user.id,
      groupId: groupId,
    });

    if (group.memberCount == 1) {
      await this.groupsRepository.softDelete(groupId);
    }
  }
}
