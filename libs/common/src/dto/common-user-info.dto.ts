import { ApiProperty } from '@nestjs/swagger';

export class CommonUserInfoDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  gameDbId: number;

  @ApiProperty()
  nid: string;

  @ApiProperty()
  database?: string;

  static get emptyDto():CommonUserInfoDto {
    return {
      userId: null,
      gameDbId: null,
      database: null,
      nid: null,
    }
  }
}
