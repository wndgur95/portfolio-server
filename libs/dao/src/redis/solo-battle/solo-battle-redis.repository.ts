import { Injectable } from '@nestjs/common';
import {
  BASE_SOLO_BATTLE_PLAY_KEY,
  BATTLE_INFO_KEY,
  RedisDbNumber,
} from '@libs/common/constants/redis.constants';
import { AbstractRedisRepository } from '@libs/common/databases/redis/abstract-redis.repository';
import { BattleInfoDto } from '@libs/dao/redis/solo-battle/dto/battle-info.dto';
import { plainToInstance } from 'class-transformer';
import { ClientDataDto } from '@libs/dao/redis/solo-battle/dto/client-data.dto';

@Injectable()
export class SoloBattleRedisRepository extends AbstractRedisRepository {
  protected readonly dbNumber = RedisDbNumber.SOLO_BATTLE_SOCKET;
  private readonly BATTLE_TTL = 3600; // 1시간
  private readonly CLIENT_TTL = 300; // 5분

  constructor() {
    super();
    this.createRedisClient();
  }

  async getBattleInfo(userId: number | string): Promise<BattleInfoDto> {
    const key = `${BATTLE_INFO_KEY}:${userId}`;
    const result = JSON.parse(await this.redis.get(key));

    return plainToInstance(BattleInfoDto, result);
  }

  async setBattleInfo(
    userId: number | string,
    battleInfo: BattleInfoDto,
  ): Promise<void> {
    const key = `${BATTLE_INFO_KEY}:${userId}`;

    this.redis.set(key, JSON.stringify(battleInfo), 'EX', this.BATTLE_TTL); //  session, ttl 동시세팅
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async delBattleInfo(userId: number | string): Promise<void> {
    const key = `${BATTLE_INFO_KEY}:${userId}`;
    this.redis.del(key);
  }

  async getClientData(clientId: string): Promise<ClientDataDto> {
    const key = `${BASE_SOLO_BATTLE_PLAY_KEY}:client:${clientId}`;
    const result = JSON.parse(await this.redis.get(key));

    return plainToInstance(ClientDataDto, result);
  }

  async setClientData(clientData: ClientDataDto): Promise<'OK'> {
    const key = `${BASE_SOLO_BATTLE_PLAY_KEY}:client:${clientData.clientId}`;
    const seconds = this.CLIENT_TTL;

    return this.redis.setex(key, seconds, JSON.stringify(clientData));
  }

  async delClientData(clientId: string): Promise<void> {
    const key = `${BASE_SOLO_BATTLE_PLAY_KEY}:client:${clientId}`;

    this.redis.del(key);
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    return this.redis.setex(key, seconds, value);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }

  delBattleInfoMulti(userId: number): void {
    const key = `${BATTLE_INFO_KEY}:${userId}`;
    const multi = this.multi;

    multi.del(key);
  }
}
