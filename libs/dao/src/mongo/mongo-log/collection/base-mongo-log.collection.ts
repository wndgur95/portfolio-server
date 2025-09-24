import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseLogCollection } from '@libs/dao/mongo/mongo-log/collection/base-log.collection';
import { NODE_ENV } from '@libs/common/constants/environment.constants';
import { ContextProvider } from '@libs/common/provider/context.provider';

export class BaseMongoLogCollection extends BaseLogCollection {
  @ApiProperty()
  @IsString()
  environment = NODE_ENV;

  @ApiProperty()
  @IsString()
  nid: string;

  @ApiProperty()
  @IsNumber()
  gameDbId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  constructor(partial?: Partial<BaseMongoLogCollection>) {
    super(partial);
    Object.assign(this, partial);

    const { nid, gameDbId, userId } = ContextProvider.getUserInfo();
    this.nid = nid;
    this.gameDbId = gameDbId;
    this.userId = userId;
  }
}
