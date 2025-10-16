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
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';
import {
  MISSION_CONDITION_TYPE,
} from '@libs/dao/static/common.constants';
import { MissionService } from '../../src/mission/mission.service';
import { DataMissionRepository } from '@libs/dao/static/data-mission/data-mission.repository';
import { TestMissionUtils } from '../utils/test-mission.utils';
import { AchievementProvider } from '@libs/common/provider/achievement/achievement.provider';

describe('MissionService', () => {
  let module: TestingModule;

  let missionService: MissionService;
  let goodsProvider: GoodsProvider;
  let dataMissionRepository: DataMissionRepository;
  let achievementProvider: AchievementProvider;

  const userId = 1;
  const gameDbId = 100;

  beforeAll(async () => {
    module = await getTestModule;

    // service
    missionService = module.get(MissionService);
    goodsProvider = module.get(GoodsProvider);
    dataMissionRepository = module.get(DataMissionRepository);
    achievementProvider = module.get(AchievementProvider);
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

  describe('getMission', () => {
    it('미션 정보 받기', async () => {
      const clearedMissions =
        await TestMissionUtils.createMission(achievementProvider);
      const missions = await missionService.getMissions();

      expect(missions.length).toEqual(clearedMissions.length);

      for (const mission of missions) {
        expect(mission.id).not.toBeNull();
        expect(mission.userId).toBe(userId);
        const dataMission = dataMissionRepository.findById(
          mission.dataMissionId,
        );
        expect(dataMission).not.toBeNull();
      }
    });
  });

  describe('receive mission reward error', () => {
    it('캐릭터 갯수 부족 에러', async () => {

      const clearedMissions = await TestMissionUtils.createMission(
        achievementProvider,
        1,
        MISSION_CONDITION_TYPE.BATTLE,
      );

      const missionIds = clearedMissions.map((it) => it.dataMissionId);

      try {
        await missionService.receiveReward({dataMissionIds: missionIds});
        fail('MISSION_NOT_CLEARED not thrown');
      } catch (e) {
        expect(e.response).toEqual(INTERNAL_ERROR_CODE.MISSION_NOT_CLEARED);
      }

      await TestMissionUtils.createMission(
        achievementProvider,
        1000,
        MISSION_CONDITION_TYPE.BATTLE,
      );

      await missionService.receiveReward({dataMissionIds: missionIds});
    });
  });
});
