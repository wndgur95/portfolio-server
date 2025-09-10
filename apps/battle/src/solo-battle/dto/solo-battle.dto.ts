import { IsString, IsNumber, IsObject, IsOptional, IsArray } from 'class-validator';

export namespace SoloBattleDto {
  export class JoinBattleDto {
    @IsString()
    battleId: string;

    @IsString()
    userId: string;
  }

  export class LeaveBattleDto {
    @IsString()
    battleId: string;
  }

  export class PlayerMoveDto {
    @IsString()
    battleId: string;

    @IsObject()
    position: {
      x: number;
      y: number;
    };
  }

  export class MonsterSpawnDto {
    @IsString()
    battleId: string;

    @IsString()
    monsterType: string;

    @IsObject()
    position: {
      x: number;
      y: number;
    };
  }

  export class MonsterDefeatedDto {
    @IsString()
    battleId: string;

    @IsString()
    monsterId: string;
  }

  export class LevelUpDto {
    @IsString()
    battleId: string;

    @IsNumber()
    newLevel: number;

    @IsObject()
    newStats: {
      hp: number;
      attack: number;
      defense: number;
      speed: number;
    };
  }

  export class ItemDropDto {
    @IsString()
    battleId: string;

    @IsString()
    itemType: string;

    @IsObject()
    position: {
      x: number;
      y: number;
    };
  }

  export class ItemPickupDto {
    @IsString()
    battleId: string;

    @IsString()
    itemId: string;
  }

  export class BattleStatusDto {
    @IsString()
    battleId: string;
  }

  // 응답 DTO들
  export class BattleJoinedResponse {
    battleId: string;
    clientId: string;
    userId: string;
    status: 'success' | 'error';
    message?: string;
  }

  export class MonsterSpawnedResponse {
    monsterId: string;
    monsterType: string;
    position: {
      x: number;
      y: number;
    };
    timestamp: number;
  }

  export class MonsterDefeatedResponse {
    monsterId: string;
    experience: number;
    items?: Array<{
      itemId: string;
      itemType: string;
      position: {
        x: number;
        y: number;
      };
    }>;
    timestamp: number;
  }

  export class ItemDroppedResponse {
    itemId: string;
    itemType: string;
    position: {
      x: number;
      y: number;
    };
    timestamp: number;
  }

  export class ItemPickedUpResponse {
    itemId: string;
    itemType: string;
    stats?: {
      hp?: number;
      attack?: number;
      defense?: number;
      speed?: number;
    };
    timestamp: number;
  }

  export class BattleStatusResponse {
    battleId: string;
    players: Array<{
      clientId: string;
      userId: string;
      position: {
        x: number;
        y: number;
      };
      level: number;
      stats: {
        hp: number;
        attack: number;
        defense: number;
        speed: number;
      };
    }>;
    monsters: Array<{
      monsterId: string;
      monsterType: string;
      position: {
        x: number;
        y: number;
      };
      hp: number;
      maxHp: number;
    }>;
    items: Array<{
      itemId: string;
      itemType: string;
      position: {
        x: number;
        y: number;
      };
    }>;
    gameTime: number;
    status: 'active' | 'paused' | 'ended';
  }
}
