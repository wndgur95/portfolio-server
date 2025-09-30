import { Inject, Injectable } from '@nestjs/common';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { CharactersDbRepositories } from '@libs/dao/game/characters/repositories/characters-db.repository';
import { CharactersRepository } from '@libs/dao/game/characters/interfaces/characters-repository.interface';
import { PaginationInDto } from '@libs/common/dto/pagination-in.dto';
import { UserFilterDto } from '../user/dto/user-filter.dto';
import { PaginationOutDto } from '@libs/common/dto/pagination-out.dto';
import { Character } from '@libs/dao/game/characters/interfaces/character.interface';

@Injectable()
export class CharacterService {
  constructor(
    @Inject(CharactersRepository)
    private readonly charactersRepositories: CharactersDbRepositories,
  ) {}

  async getCharacters(
    pagination: PaginationInDto<UserFilterDto>,
  ): Promise<[Character[], PaginationOutDto]> {
    const { userId, database } = ContextProvider.getSelectedUser();

    const take = pagination.size ?? 20;
    const page = pagination.page ?? 1;
    const skip = (page - 1) * take;
    const order = pagination.order ?? 'DESC';

    const mergedFilter = {
      ...pagination.filter,
      userId: { type: 'eq', value: userId },
    };

    const [characters, total] = await this.charactersRepositories[
      database
    ].findAllWithFilterAndCount(take, skip, order, mergedFilter);

    return [
      characters,
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
