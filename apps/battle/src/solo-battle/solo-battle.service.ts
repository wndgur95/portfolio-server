import { Injectable, Logger } from '@nestjs/common';
import { SoloBattleRedisRepository } from '@libs/dao/redis/solo-battle/solo-battle-redis.repository';
import { SoloBattleDto } from './dto/solo-battle.dto';
import { BASE_SOLO_BATTLE_PLAY_KEY } from '@libs/common/constants/redis.constants';
import { ClientDataDto } from '@libs/dao/redis/solo-battle/dto/client-data.dto';
import { Socket } from 'socket.io';
import { DataCharacterProvider } from '@libs/common/provider/static-data/data-character.provider';
import { PlayerDto } from '@libs/dao/redis/solo-battle/dto/player.dto';
import { PLAY_STATUS, PlayStatus } from '@libs/dao/static/common.constants';

@Injectable()
export class SoloBattleService {
  private readonly logger = new Logger(SoloBattleService.name);

  private readonly baseKey = BASE_SOLO_BATTLE_PLAY_KEY;

  constructor(
    private readonly soloBattleRepository: SoloBattleRedisRepository,
    private readonly dataCharacterProvider: DataCharacterProvider,
  ) {}

  /**
   * 클라이언트 초기화
   */
  async initializeClient(clientId: string): Promise<void> {
    const clientData = ClientDataDto.create({
      clientId,
      connectedAt: Date.now(),
      status: 'connected',
    });

    await this.soloBattleRepository.setClientData(clientData);
    this.logger.log(`Client ${clientId} initialized`);
  }

  /**
   * 클라이언트 정리
   */
  async cleanupClient(clientId: string): Promise<void> {
    const clientData = await this.soloBattleRepository.getClientData(clientId);

    if (clientData) {
      if (clientData.battleId) {
        await this.leaveBattle(
          clientId,
          clientData.userId,
          PLAY_STATUS.GIVE_UP,
        );
      }
      await this.soloBattleRepository.delClientData(clientId);
    }

    this.logger.log(`Client ${clientId} cleaned up`);
  }

  /**
   * 배틀 참가
   */
  async joinBattle(
    client: Socket,
    battleId: string,
    userId: string,
  ): Promise<SoloBattleDto.BattleJoinedResponse> {
    let battleInfo = null;
    try {
      // 배틀 정보 가져오기
      battleInfo = await this.soloBattleRepository.getBattleInfo(userId);

      if (!battleInfo || battleId != battleInfo.battleUid) {
        this.logger.warn(`전투 입장을 하지 않았습니다.`);
        client.emit('error', { message: '전투 입장을 하지 않았습니다.' });
        client.disconnect();
        return;
      }

      const { dataCharacterId, level } = battleInfo;

      battleInfo.clientId = client.id;
      battleInfo.joinedAt = Date.now();

      // 플레이어 추가
      battleInfo.player = PlayerDto.create({
        level: 12,
        kill: 13,
        exp: 1,
        nextLevel: 100,
        stats: this.dataCharacterProvider.getStats(dataCharacterId, level),
      });

      battleInfo.enemies = [];

      // 배틀 데이터 저장
      await this.soloBattleRepository.setBattleInfo(userId, battleInfo);

      // 클라이언트 정보 업데이트
      const clientData = ClientDataDto.create({
        clientId: client.id,
        battleId,
        userId,
        connectedAt: Date.now(),
        status: 'in-battle',
      });

      await this.soloBattleRepository.setClientData(clientData);

      this.logger.log(`Client ${client.id} joined battle ${battleId}`);
      this.logger.log(`=== [SoloBattleService] joinBattle 완료, 결과 반환 ===`);
      this.logger.log(`BattleInfo: ${JSON.stringify(battleInfo)}`);

      return {
        battleInfo,
        status: 'success',
        message: 'Successfully joined battle',
      };
    } catch (error) {
      this.logger.error(`Error joining battle:`, error);
      return {
        battleInfo,
        status: 'error',
        message: 'Failed to join battle',
      };
    }
  }

  /**
   * 배틀 떠나기
   */
  async leaveBattle(
    clientId: string,
    userId: number | string,
    playStatus: PlayStatus,
  ): Promise<void> {
    if (playStatus != PLAY_STATUS.END) {
      await this.soloBattleRepository.delBattleInfo(userId);
    }

    // 클라이언트 정보 업데이트
    const clientData = await this.soloBattleRepository.getClientData(clientId);
    if (clientData) {
      delete clientData.battleId;
      clientData.status = 'connected';
      await this.soloBattleRepository.setClientData(clientData);
    }

    this.logger.log(`Client ${clientId} left battle`);
  }
}
