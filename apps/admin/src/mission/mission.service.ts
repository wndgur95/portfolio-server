import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { PaginationInDto } from '@libs/common/dto/pagination-in.dto';
import { UserFilterDto } from '../user/dto/user-filter.dto';
import { PaginationOutDto } from '@libs/common/dto/pagination-out.dto';
import { MissionsRepository } from '@libs/dao/game/missions/interfaces/missions-repository.interface';
import { MissionsDbRepositories } from '@libs/dao/game/missions/repositories/missions-db.repository';
import { Mission } from '@libs/dao/game/missions/interfaces/mission.interface';

@Injectable()
export class MissionService {
  constructor(
    @Inject(MissionsRepository)
    private readonly missionsRepositories: MissionsDbRepositories,
  ) {}

  async getMissions(
    pagination: PaginationInDto<UserFilterDto>,
  ): Promise<[Mission[], PaginationOutDto]> {
    const { userId, database } = ContextProvider.getSelectedUser();

    const take = pagination.size ?? 20;
    const page = pagination.page ?? 1;
    const skip = (page - 1) * take;
    const order = pagination.order ?? 'DESC';

    const mergedFilter = {
      ...pagination.filter,
      userId: { type: 'eq', value: userId },
    };

    const [missions, total] = await this.missionsRepositories[
      database
    ].findAllWithFilterAndCount(take, skip, order, mergedFilter);

    return [
      missions,
      PaginationOutDto.of({
        total,
        page,
        size: take,
        order,
        filter: pagination.filter,
      }),
    ];
  }
}
