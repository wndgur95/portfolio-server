import { getTestModule } from '../test-module/test.module';
import { TestingModule } from '@nestjs/testing';
import { TestTransactionUtils } from '@libs/common/utils/test/test-transaction.utils';
import { DB_NAME } from '@libs/common/constants/database.constants';
import { TestDataSourceUtils } from '@libs/common/utils/test/test-data-source.utils';
import { TestRedisDataSourceUtils } from '@libs/common/utils/test/test-redis-data-source.utils';
import { TestContextUtils } from '@libs/common/utils/test/test-context.utils';
import { TypeOrmHelper } from '@libs/common/databases/typeorm/typeorm.helper';
import { TestUserUtils } from '../utils/test-user.utils';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { GoodsProvider } from '@libs/common/provider/goods/goods.provider';
import { CharacterService } from '../../src/character/character.service';
import { DataCharacterRepository } from '@libs/dao/static/data-character/data-character.repository';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import { DataBalance } from '@libs/dao/static/data-balance/data-balance.entity';
import { DataBalanceRepository } from '@libs/dao/static/data-balance/data-balance.repository';
import { GOODS_TYPE } from '@libs/dao/static/common.constants';
import { Reward } from '@libs/common/interface/goods.interface';

describe('CharacterService', () => {
  let module: TestingModule;

  let characterService: CharacterService;
  let goodsProvider: GoodsProvider;
  let dataCharacterRepository: DataCharacterRepository;
  let dataBalanceRepository: DataBalanceRepository;

  const userId = 1;
  const gameDbId = 100;

  beforeAll(async () => {
    module = await getTestModule;

    // service
    characterService = module.get(CharacterService);
    goodsProvider = module.get(GoodsProvider);
    dataCharacterRepository = module.get(DataCharacterRepository);
    dataBalanceRepository = module.get(DataBalanceRepository);
  });

  beforeEach(async () => {
    await TypeOrmHelper.Transactional([DB_NAME.COMMON]);

    await TestUserUtils.login(userId, gameDbId);

    const { database } = ContextProvider.getSession();
    await TypeOrmHelper.Transactional([database]);
    await TestUserUtils.createUserDetail(goodsProvider);
  });

  afterEach(async () => {
    await TestTransactionUtils.rollback();
    TestContextUtils.releaseContexts();
  });

  afterAll(async () => {
    await Promise.all([
      TestDataSourceUtils.clearDataSource(module),
      TestRedisDataSourceUtils.clearRedisDataSource(module),
    ]);
  });

  describe('getCharacter', () => {
    it('캐릭터 정보 받기', async () => {
      const characters = await characterService.getCharacters();

      expect(characters.length).toBeGreaterThan(0);

      for (const character of characters) {
        expect(character.userId).toBe(userId);
        const dataCharacter = dataCharacterRepository.findById(
          character.dataCharacterId,
        );
        expect(dataCharacter).not.toBeNull();
      }
    });
  });

  describe('levelUpCharacter error', () => {
    it('캐릭터 갯수 부족 에러', async () => {
      const characters = await characterService.getCharacters();
      const character = characters[0];

      try {
        await characterService.levelUpCharacter({
          dataCharacterId: character.dataCharacterId,
        });
        fail('CHARACTER_NOT_ENOUGH not thrown');
      } catch (e) {
        expect(e.response).toEqual(INTERNAL_ERROR_CODE.CHARACTER_NOT_ENOUGH);
      }
    });
  });

  describe('levelUpCharacter 정상', () => {
    it('캐릭터 갯수 부족 에러', async () => {
      const characters = await characterService.getCharacters();
      const character = characters[0];

      const needCount = dataBalanceRepository.findById(
        DataBalance.BALANCE_CHARACTER_LEVEL_UP,
      ).INDEX[character.level];

      await goodsProvider.payImmediately([
        {
          goodsType: GOODS_TYPE.CHARACTER,
          dataId: character.dataCharacterId,
          quantity: needCount,
        } as Reward,
      ]);

      const levelUpCharacter = await characterService.levelUpCharacter({
        dataCharacterId: character.dataCharacterId,
      });

      expect(levelUpCharacter.level).toEqual(character.level + 1);
    });
  });
});
