import { Inject, Injectable } from '@nestjs/common';
import { GroupsRepository } from '@libs/dao/common/groups/interfaces/groups-repository.interface';
import { GroupMembersRepository } from '@libs/dao/common/group-members/interfaces/group-members-repository.interface';
import { PageOptionsDto } from '@libs/common/pagination/dto/page-options.dto';
import { PageMetaDto } from '@libs/common/pagination/dto/page-meta.dto';
import {
  GetExpenditureInDto,
  GetExpenditureOutDto,
} from './dto/get-expenditure.dto';
import { ExpendituresDbRepositories } from '@libs/dao/group/expenditures/repositories/expenditures-db.repository';
import { ExpendituresRepository } from '@libs/dao/group/expenditures/interfaces/expenditures-repository.interface';
import { User } from '@libs/dao/common/users/interfaces/user.interface';
import { ServerErrorException } from '@libs/common/exception/server-error.exception';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { getDatabaseByGroupDbId } from '@libs/dao/config/group/group-database-config.util';
import {
  AmountType,
  DateType,
} from '@libs/common/constants/expenditure.constats';
import {
  Transactional,
  TransactionalEx,
} from '@libs/common/decorator/transaction.decorator';
import { DB_NAME } from '@libs/common/constants/database.constants';
import {
  CreateExpenditureInDto,
  CreateExpenditureOutDto,
} from './dto/create-expenditure.dto';
import { Expenditure } from '@libs/dao/group/expenditures/interfaces/expenditure.interface';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { ExpenditureEntity } from '@libs/dao/group/expenditures/entities/expenditure.entity';
import {
  UpdateExpenditureInDto,
  UpdateExpenditureOutDto,
} from './dto/update-expenditure.dto';
import { GroupMember } from '@libs/dao/common/group-members/interfaces/group-member.interface';
import { InviteGroupMemberInDto } from './dto/invite-group-member.dto';
import { FriendsDbRepositories } from '@libs/dao/user/friends/repositories/friends-db.repository';
import { FriendsRepository } from '@libs/dao/user/friends/interfaces/friends-repository.interface';
import { FriendRequestType } from '@libs/common/constants/friend.constants';
import { GROUP_MEMBER_ROLES } from '@libs/common/constants/role.constants';
import { UsersRepository } from '@libs/dao/common/users/interfaces/users-repository.interface';
import { GroupMemberEntity } from '@libs/dao/common/group-members/entities/group-member.entity';
import { Group } from '@libs/dao/common/groups/interfaces/group.interface';
import {
  AmountDto,
  GetExpenditureCalendarInDto,
  GetExpenditureCalendarOutDto,
} from './dto/get-expenditure-calendar.dto';

@Injectable()
export class ExpenditureService {
  constructor(
    @Inject(GroupMembersRepository)
    private readonly groupMembersRepository: GroupMembersRepository,
    @Inject(GroupsRepository)
    private readonly groupsRepository: GroupsRepository,
    @Inject(ExpendituresRepository)
    private readonly expendituresRepositories: ExpendituresDbRepositories,
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,

    @Inject(FriendsRepository)
    private readonly friendsDbRepositories: FriendsDbRepositories,
  ) {}

  async getExpenditure(
    user: User,
    getExpenditureInDto: GetExpenditureInDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<[GetExpenditureOutDto, PageMetaDto]> {
    const { groupId, groupMemberId, dateType, year, month, week, day } =
      getExpenditureInDto;
    const { take, skip, order } = pageOptionsDto;

    const groupMember = await this.groupMembersRepository.findOneBy({
      userId: user.id,
      groupId,
    });

    if (!groupMember) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.EXPENDITURE_GROUP_NOT_JOIN,
      );
    }

    const group = await this.groupsRepository.findById(groupId);
    const database = getDatabaseByGroupDbId(group.groupDbId);

    const { startAt, endAt } = this._getDateRange(
      dateType,
      year,
      month,
      week,
      day,
    );

    const [expenditures, totalCount, totalAmount] =
      await this.expendituresRepositories[
        database
      ].findManyAndCountAndSumByGetExpenditure(
        groupId,
        groupMemberId,
        take,
        skip,
        order,
        startAt,
        endAt,
      );

    return [
      GetExpenditureOutDto.of({ expenditures, totalAmount }),
      new PageMetaDto({
        pageOptionsDto,
        itemCount: totalCount,
      }),
    ];
  }

  async getExpenditureCalendar(
    user: User,
    getExpenditureCalendarInDto: GetExpenditureCalendarInDto,
  ): Promise<GetExpenditureCalendarOutDto> {
    const { groupId, groupMemberId, year, month } = getExpenditureCalendarInDto;

    const startAt = new Date(year, month - 1, 1); // 해당 월 1일 00:00:00
    const endAt = new Date(year, month, 1); // 다음 달 1일 00:00:00

    const groupMember = await this.groupMembersRepository.findOneBy({
      userId: user.id,
      groupId,
    });

    if (!groupMember) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.EXPENDITURE_GROUP_NOT_JOIN,
      );
    }

    const group = await this.groupsRepository.findById(groupId);
    const database = getDatabaseByGroupDbId(group.groupDbId);

    const [expenditures, totalAmount] = await this.expendituresRepositories[
      database
    ].findManyAndSumByDate(groupId, groupMemberId, startAt, endAt);

    const getExpenditureCalendarOutDto = GetExpenditureCalendarOutDto.of({
      amountByDay: {},
      totalAmount,
    });
    const amountByDay = getExpenditureCalendarOutDto.amountByDay;

    for (const expenditure of expenditures) {
      const { amountType, amount, expenditureAt } = expenditure;
      const day = expenditureAt.getDate();

      if (!amountByDay[day]) {
        amountByDay[day] = new AmountDto();
      }

      if (amountType == AmountType.Add) {
        amountByDay[day].addAmount += amount;
      } else if (amountType == AmountType.Sub) {
        amountByDay[day].subAmount += amount;
      }
    }

    return getExpenditureCalendarOutDto;
  }

  @TransactionalEx(DB_NAME.COMMON)
  async createExpenditure(
    user: User,
    createExpenditureInDto: CreateExpenditureInDto,
  ): Promise<CreateExpenditureOutDto> {
    const { groupId, emoji, amountType, amount, desc, expenditureAt } =
      createExpenditureInDto;

    await this.groupsRepository.findById(groupId);
    const userGroupMember = await this.groupMembersRepository.findOneBy({
      userId: user.id,
      groupId,
    });

    if (!userGroupMember) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.EXPENDITURE_GROUP_NOT_JOIN,
      );
    }

    const { id: groupMemberId } = userGroupMember;

    const expenditure = await this._saveExpenditure(
      ExpenditureEntity.create({
        groupId,
        groupMemberId,
        userId: user.id,
        emoji,
        amountType,
        amount,
        desc,
        expenditureAt,
      }),
    );

    return CreateExpenditureOutDto.of({ expenditure });
  }

  @TransactionalEx(DB_NAME.COMMON)
  async updateExpenditure(
    user: User,
    expenditureId: number,
    updateExpenditureInDto: UpdateExpenditureInDto,
  ): Promise<UpdateExpenditureOutDto> {
    const { groupId, emoji, amountType, amount, desc, expenditureAt } =
      updateExpenditureInDto;

    await this.groupsRepository.findById(groupId);

    const database = ContextProvider.getGroupDatabase();
    const expenditure =
      await this.expendituresRepositories[database].findById(expenditureId);

    await this._checkExpenditure(user.id, expenditure);

    expenditure.emoji = emoji;
    expenditure.amountType = amountType;
    expenditure.amount = amount;
    expenditure.desc = desc;
    expenditure.expenditureAt = expenditureAt;

    await this._saveExpenditure(expenditure);

    return UpdateExpenditureOutDto.of({ expenditure });
  }

  @TransactionalEx(DB_NAME.COMMON)
  async deleteExpenditure(
    user: User,
    groupId: number,
    expenditureId: number,
  ): Promise<void> {
    await this.groupsRepository.findById(groupId);

    await this._deleteExpenditure(user.id, expenditureId);
  }

  @Transactional(DB_NAME.COMMON)
  async inviteGroupMember(
    user: User,
    inviteGroupMemberInDto: InviteGroupMemberInDto,
  ): Promise<GroupMember> {
    const { groupId, friendId } = inviteGroupMemberInDto;

    const group = await this.groupsRepository.findById(groupId);
    const groupMember = await this.groupMembersRepository.findOneBy({
      groupId: groupId,
      userId: user.id,
    });

    if (!groupMember || groupMember.role != GROUP_MEMBER_ROLES.MASTER) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.GROUP_MEMBER_ROLE_INVALID,
        ['마스터'],
      );
    }

    const database = ContextProvider.getUserDatabase();
    const friend =
      await this.friendsDbRepositories[database].findById(friendId);

    if (!friend || friend.status != FriendRequestType.Accept) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.EXPENDITURE_INVITE_NOT_FRIEND,
      );
    }

    const friendGroupMember = await this.groupMembersRepository.findOneBy({
      groupId: groupId,
      userId: friend.friendUserId,
    });
    const friendUser = await this.usersRepository.findById(friend.friendUserId);
    if (friendGroupMember) {
      throw new ServerErrorException(
        INTERNAL_ERROR_CODE.EXPENDITURE_ALREADY_INVITE,
        [friendUser.name],
      );
    }

    return await this._inviteGroupMember(friendUser, group);
  }

  @Transactional()
  private async _saveExpenditure(
    expenditure: Expenditure,
  ): Promise<Expenditure> {
    const database = ContextProvider.getGroupDatabase();

    return await this.expendituresRepositories[database].save(expenditure);
  }

  @Transactional()
  private async _deleteExpenditure(
    userId: number,
    expenditureId: number,
  ): Promise<void> {
    const database = ContextProvider.getGroupDatabase();

    const expenditure =
      await this.expendituresRepositories[database].findById(expenditureId);

    await this._checkExpenditure(userId, expenditure);

    await this.expendituresRepositories[database].softDelete(expenditureId);
  }

  @Transactional()
  private async _inviteGroupMember(
    friendUser: User,
    group: Group,
  ): Promise<GroupMember> {
    group.memberCount += 1;
    await this.groupsRepository.save(group, { reload: false });

    return await this.groupMembersRepository.save(
      GroupMemberEntity.create({
        groupId: group.id,
        userId: friendUser.id,
        name: friendUser.name,
        role: GROUP_MEMBER_ROLES.MEMBER,
        signUpAt: ContextProvider.getNow(),
      }),
    );
  }

  private async _checkExpenditure(
    userId: number,
    expenditure: Expenditure,
  ): Promise<void> {
    if (expenditure.userId != userId) {
      const groupMember = await this.groupMembersRepository.findById(
        expenditure.groupMemberId,
      );
      throw new ServerErrorException(INTERNAL_ERROR_CODE.EXPENDITURE_NOT_MINE, [
        groupMember.name,
      ]);
    }
  }

  private _getDateRange(
    dateType: DateType,
    year: number,
    month: number,
    week: number,
    day: number,
  ): { startAt: Date; endAt: Date } {
    let startAt: Date;
    let endAt: Date;

    switch (dateType) {
      case DateType.Year: {
        startAt = new Date(year, 0, 1); // 1월 1일 00:00:00
        endAt = new Date(year + 1, 0, 1); // 다음 해 1월 1일 00:00:00
        return { startAt, endAt };
      }
      case DateType.Month: {
        startAt = new Date(year, month - 1, 1); // 해당 월 1일 00:00:00
        endAt = new Date(year, month, 1); // 다음 달 1일 00:00:00
        return { startAt, endAt };
      }
      case DateType.Week: {
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const startOfWeek = new Date(firstDayOfMonth);
        startOfWeek.setDate((week - 1) * 7 + 1); // 해당 주차의 시작일
        startOfWeek.setHours(0, 0, 0, 0);

        endAt = new Date(startOfWeek);
        endAt.setDate(startOfWeek.getDate() + 7); // 다음 주의 첫날 00:00:00

        startAt = startOfWeek;
        return { startAt, endAt };
      }
      case DateType.Day:
      case DateType.Calendar: {
        startAt = new Date(year, month - 1, day); // 해당 일 00:00:00
        endAt = new Date(year, month - 1, day + 1); // 다음 날 00:00:00
        return { startAt, endAt };
      }
    }
  }
}
