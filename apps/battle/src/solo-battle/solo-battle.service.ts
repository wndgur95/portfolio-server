import { Injectable, Logger } from '@nestjs/common';
import { SoloBattleRedisRepository } from '@libs/dao/redis/solo-battle/solo-battle-redis.repository';
import { SoloBattleDto } from './dto/solo-battle.dto';

@Injectable()
export class SoloBattleService {
  private readonly logger = new Logger(SoloBattleService.name);
  private readonly BATTLE_TTL = 3600; // 1시간
  private readonly CLIENT_TTL = 300; // 5분

  constructor(private readonly soloBattleRepository: SoloBattleRedisRepository) {}

  /**
   * 클라이언트 초기화
   */
  async initializeClient(clientId: string): Promise<void> {
    const clientData = {
      clientId,
      connectedAt: Date.now(),
      status: 'connected',
    };

    await this.soloBattleRepository.setex(`solo-battle:client:${clientId}`, this.CLIENT_TTL, JSON.stringify(clientData));
    this.logger.log(`Client ${clientId} initialized`);
  }

  /**
   * 클라이언트 정리
   */
  async cleanupClient(clientId: string): Promise<void> {
    const clientDataStr = await this.soloBattleRepository.get(`solo-battle:client:${clientId}`);
    const clientData = clientDataStr ? JSON.parse(clientDataStr) : null;
    
    if (clientData) {
      if (clientData.battleId) {
        await this.leaveBattle(clientId, clientData.battleId);
      }
      await this.soloBattleRepository.del(`solo-battle:client:${clientId}`);
    }
    
    this.logger.log(`Client ${clientId} cleaned up`);
  }

  /**
   * 배틀 참가
   */
  async joinBattle(
    clientId: string,
    battleId: string,
    userId: string,
  ): Promise<SoloBattleDto.BattleJoinedResponse> {
    try {
      // 배틀 정보 가져오기
      const battleDataStr = await this.soloBattleRepository.get(`solo-battle:battle:${battleId}`);
      let battleData = battleDataStr ? JSON.parse(battleDataStr) : null;
      
      if (!battleData) {
        // 새 배틀 생성
        battleData = {
          battleId,
          status: 'active',
          createdAt: Date.now(),
          players: [],
          monsters: [],
          items: [],
          gameTime: 0,
        };
      }

      // 플레이어 추가
      const player = {
        clientId,
        userId,
        position: { x: 0, y: 0 },
        level: 1,
        stats: {
          hp: 100,
          attack: 10,
          defense: 5,
          speed: 5,
        },
        joinedAt: Date.now(),
      };

      // 기존 플레이어 제거 (같은 clientId)
      battleData.players = battleData.players.filter((p: any) => p.clientId !== clientId);
      battleData.players.push(player);

      // 배틀 데이터 저장
      await this.soloBattleRepository.setex(`solo-battle:battle:${battleId}`, this.BATTLE_TTL, JSON.stringify(battleData));

      // 클라이언트 정보 업데이트
      const clientData = {
        clientId,
        battleId,
        userId,
        connectedAt: Date.now(),
        status: 'in-battle',
      };
      await this.soloBattleRepository.setex(`solo-battle:client:${clientId}`, this.CLIENT_TTL, JSON.stringify(clientData));

      this.logger.log(`Client ${clientId} joined battle ${battleId}`);
      
      return {
        battleId,
        clientId,
        userId,
        status: 'success',
        message: 'Successfully joined battle',
      };
    } catch (error) {
      this.logger.error(`Error joining battle:`, error);
      return {
        battleId,
        clientId,
        userId,
        status: 'error',
        message: 'Failed to join battle',
      };
    }
  }

  /**
   * 배틀 떠나기
   */
  async leaveBattle(clientId: string, battleId: string): Promise<void> {
    const battleKey = `solo-battle:battle:${battleId}`;
    const battleData = await this.soloBattleRepository.get(battleKey);
    
    if (battleData) {
      const parsed = JSON.parse(battleData);
      parsed.players = parsed.players.filter((p: any) => p.clientId !== clientId);
      
      await this.soloBattleRepository.setex(battleKey, this.BATTLE_TTL, JSON.stringify(parsed));
    }

    // 클라이언트 정보 업데이트
    const clientKey = `solo-battle:client:${clientId}`;
    const clientData = await this.soloBattleRepository.get(clientKey);
    if (clientData) {
      const parsed = JSON.parse(clientData);
      delete parsed.battleId;
      parsed.status = 'connected';
      await this.soloBattleRepository.setex(clientKey, this.CLIENT_TTL, JSON.stringify(parsed));
    }

    this.logger.log(`Client ${clientId} left battle ${battleId}`);
  }

  /**
   * 플레이어 위치 업데이트
   */
  async updatePlayerPosition(
    clientId: string,
    battleId: string,
    position: { x: number; y: number },
  ): Promise<void> {
    const battleKey = `solo-battle:battle:${battleId}`;
    const battleData = await this.soloBattleRepository.get(battleKey);
    
    if (battleData) {
      const parsed = JSON.parse(battleData);
      const player = parsed.players.find((p: any) => p.clientId === clientId);
      
      if (player) {
        player.position = position;
        player.lastUpdate = Date.now();
        await this.soloBattleRepository.setex(battleKey, this.BATTLE_TTL, JSON.stringify(parsed));
      }
    }
  }

  /**
   * 몬스터 스폰
   */
  async spawnMonster(
    battleId: string,
    monsterType: string,
    position: { x: number; y: number },
  ): Promise<SoloBattleDto.MonsterSpawnedResponse> {
    const battleKey = `solo-battle:battle:${battleId}`;
    const battleData = await this.soloBattleRepository.get(battleKey);
    
    if (!battleData) {
      throw new Error('Battle not found');
    }

    const parsed = JSON.parse(battleData);
    const monsterId = `monster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const monster = {
      monsterId,
      monsterType,
      position,
      hp: 100,
      maxHp: 100,
      attack: 20,
      defense: 5,
      speed: 3,
      spawnedAt: Date.now(),
    };

    parsed.monsters.push(monster);
    await this.soloBattleRepository.setex(battleKey, this.BATTLE_TTL, JSON.stringify(parsed));

    this.logger.log(`Monster ${monsterId} spawned in battle ${battleId}`);

    return {
      monsterId,
      monsterType,
      position,
      timestamp: Date.now(),
    };
  }

  /**
   * 몬스터 처치
   */
  async defeatMonster(
    clientId: string,
    battleId: string,
    monsterId: string,
  ): Promise<SoloBattleDto.MonsterDefeatedResponse> {
    const battleKey = `solo-battle:battle:${battleId}`;
    const battleData = await this.soloBattleRepository.get(battleKey);
    
    if (!battleData) {
      throw new Error('Battle not found');
    }

    const parsed = JSON.parse(battleData);
    const monsterIndex = parsed.monsters.findIndex((m: any) => m.monsterId === monsterId);
    
    if (monsterIndex === -1) {
      throw new Error('Monster not found');
    }

    const monster = parsed.monsters[monsterIndex];
    const experience = Math.floor(monster.maxHp * 0.1); // 경험치 계산
    
    // 몬스터 제거
    parsed.monsters.splice(monsterIndex, 1);

    // 아이템 드롭 확률 (30%)
    const items = [];
    if (Math.random() < 0.3) {
      const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const itemType = this.getRandomItemType();
      
      items.push({
        itemId,
        itemType,
        position: monster.position,
      });

      // 아이템을 배틀에 추가
      parsed.items.push({
        itemId,
        itemType,
        position: monster.position,
        droppedAt: Date.now(),
      });
    }

    await this.soloBattleRepository.setex(battleKey, this.BATTLE_TTL, JSON.stringify(parsed));

    this.logger.log(`Monster ${monsterId} defeated by client ${clientId}`);

    return {
      monsterId,
      experience,
      items,
      timestamp: Date.now(),
    };
  }

  /**
   * 레벨업
   */
  async levelUp(
    clientId: string,
    battleId: string,
    newLevel: number,
    newStats: { hp: number; attack: number; defense: number; speed: number },
  ): Promise<void> {
    const battleKey = `solo-battle:battle:${battleId}`;
    const battleData = await this.soloBattleRepository.get(battleKey);
    
    if (battleData) {
      const parsed = JSON.parse(battleData);
      const player = parsed.players.find((p: any) => p.clientId === clientId);
      
      if (player) {
        player.level = newLevel;
        player.stats = newStats;
        player.lastLevelUp = Date.now();
        await this.soloBattleRepository.setex(battleKey, this.BATTLE_TTL, JSON.stringify(parsed));
      }
    }

    this.logger.log(`Client ${clientId} leveled up to level ${newLevel}`);
  }

  /**
   * 아이템 드롭
   */
  async dropItem(
    battleId: string,
    itemType: string,
    position: { x: number; y: number },
  ): Promise<SoloBattleDto.ItemDroppedResponse> {
    const battleKey = `solo-battle:battle:${battleId}`;
    const battleData = await this.soloBattleRepository.get(battleKey);
    
    if (!battleData) {
      throw new Error('Battle not found');
    }

    const parsed = JSON.parse(battleData);
    const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const item = {
      itemId,
      itemType,
      position,
      droppedAt: Date.now(),
    };

    parsed.items.push(item);
    await this.soloBattleRepository.setex(battleKey, this.BATTLE_TTL, JSON.stringify(parsed));

    this.logger.log(`Item ${itemId} dropped in battle ${battleId}`);

    return {
      itemId,
      itemType,
      position,
      timestamp: Date.now(),
    };
  }

  /**
   * 아이템 획득
   */
  async pickupItem(
    clientId: string,
    battleId: string,
    itemId: string,
  ): Promise<SoloBattleDto.ItemPickedUpResponse> {
    const battleKey = `solo-battle:battle:${battleId}`;
    const battleData = await this.soloBattleRepository.get(battleKey);
    
    if (!battleData) {
      throw new Error('Battle not found');
    }

    const parsed = JSON.parse(battleData);
    const itemIndex = parsed.items.findIndex((i: any) => i.itemId === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }

    const item = parsed.items[itemIndex];
    parsed.items.splice(itemIndex, 1);

    // 아이템 효과 적용
    const stats = this.getItemStats(item.itemType);
    
    // 플레이어 스탯 업데이트
    const player = parsed.players.find((p: any) => p.clientId === clientId);
    if (player && stats) {
      player.stats.hp += stats.hp || 0;
      player.stats.attack += stats.attack || 0;
      player.stats.defense += stats.defense || 0;
      player.stats.speed += stats.speed || 0;
    }

    await this.soloBattleRepository.setex(battleKey, this.BATTLE_TTL, JSON.stringify(parsed));

    this.logger.log(`Client ${clientId} picked up item ${itemId}`);

    return {
      itemId,
      itemType: item.itemType,
      stats,
      timestamp: Date.now(),
    };
  }

  /**
   * 배틀 상태 조회
   */
  async getBattleStatus(battleId: string): Promise<SoloBattleDto.BattleStatusResponse> {
    const battleKey = `solo-battle:battle:${battleId}`;
    const battleData = await this.soloBattleRepository.get(battleKey);
    
    if (!battleData) {
      throw new Error('Battle not found');
    }

    const parsed = JSON.parse(battleData);
    
    return {
      battleId,
      players: parsed.players,
      monsters: parsed.monsters,
      items: parsed.items,
      gameTime: Date.now() - parsed.createdAt,
      status: parsed.status,
    };
  }

  /**
   * 랜덤 아이템 타입 생성
   */
  private getRandomItemType(): string {
    const itemTypes = ['health-potion', 'attack-boost', 'defense-boost', 'speed-boost'];
    return itemTypes[Math.floor(Math.random() * itemTypes.length)];
  }

  /**
   * 아이템 스탯 효과
   */
  private getItemStats(itemType: string): { hp?: number; attack?: number; defense?: number; speed?: number } | null {
    switch (itemType) {
      case 'health-potion':
        return { hp: 50 };
      case 'attack-boost':
        return { attack: 5 };
      case 'defense-boost':
        return { defense: 3 };
      case 'speed-boost':
        return { speed: 2 };
      default:
        return null;
    }
  }
}
