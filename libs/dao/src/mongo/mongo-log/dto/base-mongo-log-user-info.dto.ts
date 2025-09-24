import { ApiProperty } from '@nestjs/swagger';

export class BaseMongoLogUserInfoDto {
  @ApiProperty()
  nid: string;

  @ApiProperty()
  gameDbId: number;

  @ApiProperty()
  userId: number;

  constructor(partial?: Partial<BaseMongoLogUserInfoDto>) {
    Object.assign(this, partial);
  }
}
